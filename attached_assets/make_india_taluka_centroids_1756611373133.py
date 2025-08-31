#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Build an All-India Subdistrict (Taluka/Tehsil/Mandal) centroid CSV (WGS84).
Output columns (no "Source" column):
- State
- District
- Taluka/Tehsil
- Latitude
- Longitude

Preferred data source: geoBoundaries (ADM3), open license (CC-BY 4.0).
Fallback: GADM v4.1 (license: non-commercial use; see gadm.org/license).

Usage:
  python make_india_taluka_centroids.py --out india_taluka_centroids.csv
  python make_india_taluka_centroids.py --method geoboundaries
  python make_india_taluka_centroids.py --method gadm --out out.csv

Requirements:
  pip install geopandas pandas requests shapely pyproj fiona

Notes:
  - geoBoundaries API returns a JSON with a download URL to a GeoJSON for IND ADM3.
  - GADM Geopackage (gadm41_IND.gpkg) contains all levels; we auto-detect the layer for level 3.

"""

import io
import json
import sys
import zipfile
import argparse
from typing import List, Optional

import pandas as pd

# Optional imports (geospatial heavy)
try:
    import geopandas as gpd
    from shapely.geometry import Point
    import fiona
except Exception as e:
    print("This script needs geopandas + shapely + fiona. Install via:", file=sys.stderr)
    print("    pip install geopandas shapely fiona pyproj requests pandas", file=sys.stderr)
    raise

import requests


GEOBOUNDARIES_API = "https://www.geoboundaries.org/api/current/gbOpen/IND/ADM3/"
# In many releases, the JSON contains a key 'gjDownloadURL' for GeoJSON.
GB_DOWNLOAD_KEY_CANDIDATES = ["gjDownloadURL", "downloadURL", "gjDownloadURLSimplified", "simplifiedGeometryGeoJSON"]

# GADM v4.1 geopackage (common mirror). If this URL changes, download via the GADM "by country" page.
GADM_GPKG_URL = "https://geodata.ucdavis.edu/gadm/gadm4.1/gpkg/gadm41_IND.gpkg"


def _find_name_col(cols: List[str], candidates: List[str]) -> Optional[str]:
    for c in candidates:
        if c in cols:
            return c
    # try case-insensitive contains / alternatives
    lower = {c.lower(): c for c in cols}
    for cand in candidates:
        cl = cand.lower()
        for lc, orig in lower.items():
            if lc == cl or lc.endswith(cl) or cl in lc:
                return orig
    return None


def _standardize_columns(gdf: "gpd.GeoDataFrame") -> pd.DataFrame:
    """
    Try to extract State, District, Subdistrict names from known patterns.
    Falls back to generic names if not found.
    """
    cols = list(gdf.columns)

    # Candidates for each level (state/district/subdistrict) across common datasets
    state_candidates    = ["ADM1_EN", "ADM1_NAME", "NAME_1", "state", "STATE", "ST_NAME", "NAME1", "NAME_ENG_1"]
    district_candidates = ["ADM2_EN", "ADM2_NAME", "NAME_2", "district", "DISTRICT", "DIST_NAME", "NAME2", "NAME_ENG_2"]
    subdist_candidates  = ["ADM3_EN", "ADM3_NAME", "NAME_3", "SubDist_Name", "subdistrict", "TEHSIL", "TALUKA",
                           "TALUK", "TALUK_NAME", "MANDAL", "BLOCK", "shapeName", "NAME3", "NAME_ENG_3"]

    st_col  = _find_name_col(cols, state_candidates)    or "ADM1_NAME"
    dt_col  = _find_name_col(cols, district_candidates) or "ADM2_NAME"
    sd_col  = _find_name_col(cols, subdist_candidates)  or "ADM3_NAME"

    # Create a copy with standardized names if possible
    df = gdf.copy()
    # Ensure these columns exist; if not, create empties to avoid KeyError
    for col, std in [(st_col, "State"), (dt_col, "District"), (sd_col, "Taluka/Tehsil")]:
        if col in df.columns:
            df.rename(columns={col: std}, inplace=True)
        else:
            df[std] = None

    # Keep only those 3 and geometry
    keep = [c for c in df.columns if c in ("State", "District", "Taluka/Tehsil")] + ["geometry"]
    df = df[keep]

    # Clean whitespace
    for c in ("State", "District", "Taluka/Tehsil"):
        if c in df.columns:
            df[c] = df[c].astype(str).str.strip()

    return df


def _centroids_wgs84(gdf: "gpd.GeoDataFrame") -> pd.DataFrame:
    """
    Compute geometric centroids in a projected CRS (Web Mercator) and return WGS84 (EPSG:4326).
    """
    # Ensure we have a CRS; geoBoundaries/GADM are typically EPSG:4326
    if gdf.crs is None:
        gdf = gdf.set_crs(epsg=4326, allow_override=True)

    # Project to a metric CRS for more stable centroids over large country extents
    gdf_m = gdf.to_crs(epsg=3857)
    cent = gdf_m.geometry.centroid
    cent_wgs = gpd.GeoSeries(cent, crs=3857).to_crs(epsg=4326)

    out = gdf.copy()
    out["Latitude"]  = cent_wgs.y
    out["Longitude"] = cent_wgs.x
    return out


def _download(url: str) -> bytes:
    r = requests.get(url, timeout=120)
    r.raise_for_status()
    return r.content


def load_from_geoboundaries() -> "gpd.GeoDataFrame":
    # Hit the API to obtain the current download URL for IND ADM3
    r = requests.get(GEOBOUNDARIES_API, timeout=60)
    r.raise_for_status()
    meta = r.json()

    # Try to locate a usable GeoJSON URL
    gj_url = None
    if isinstance(meta, dict):
        for k in GB_DOWNLOAD_KEY_CANDIDATES:
            if k in meta and isinstance(meta[k], str) and meta[k].lower().endswith(".geojson"):
                gj_url = meta[k]
                break
        # Some API variants return a list of URLs in 'URLs' or similar
        if gj_url is None:
            for v in meta.values():
                if isinstance(v, str) and v.lower().endswith(".geojson"):
                    gj_url = v
                    break
    elif isinstance(meta, list):
        # Sometimes API returns a list with objects containing URLs
        for item in meta:
            if isinstance(item, dict):
                for k in GB_DOWNLOAD_KEY_CANDIDATES:
                    if k in item and isinstance(item[k], str) and item[k].lower().endswith(".geojson"):
                        gj_url = item[k]
                        break
                if gj_url:
                    break

    if gj_url is None:
        raise RuntimeError("Could not locate GeoJSON download URL from geoBoundaries API response.")

    # Read GeoJSON directly into GeoDataFrame
    gdf = gpd.read_file(gj_url)
    return gdf


def load_from_gadm() -> "gpd.GeoDataFrame":
    # Download GADM geopackage for India
    print("Downloading GADM v4.1 geopackage for India (this can be ~100MB)...", file=sys.stderr)
    gpkg_bytes = _download(GADM_GPKG_URL)

    # Save to a temporary in-memory file for fiona to read
    with open("gadm41_IND.gpkg", "wb") as f:
        f.write(gpkg_bytes)

    # Detect level 3 layer name
    layers = fiona.listlayers("gadm41_IND.gpkg")
    layer3 = None
    for lyr in layers:
        # Common patterns
        if lyr.endswith("_3") or lyr.upper().endswith("ADM_3") or lyr.upper().endswith("_L3"):
            layer3 = lyr
            break
    if layer3 is None:
        # fallback: pick the longest layer name containing '3'
        cands = [l for l in layers if "3" in l]
        layer3 = cands[0] if cands else layers[-1]

    gdf = gpd.read_file("gadm41_IND.gpkg", layer=layer3)
    return gdf


def build(method: str = "geoboundaries") -> pd.DataFrame:
    if method.lower() == "geoboundaries":
        gdf = load_from_geoboundaries()
    elif method.lower() == "gadm":
        gdf = load_from_gadm()
    else:
        raise ValueError("Unknown method. Use 'geoboundaries' or 'gadm'.")

    # Pick and standardize columns
    df = _standardize_columns(gdf)
    # Compute centroids
    df = _centroids_wgs84(df)

    # Keep only required columns
    out = df[["State", "District", "Taluka/Tehsil", "Latitude", "Longitude"]].copy()
    # Sort for readability
    out.sort_values(["State", "District", "Taluka/Tehsil"], inplace=True, ignore_index=True)
    return out


def main():
    parser = argparse.ArgumentParser(description="Create an All-India Taluka/Tehsil centroid CSV (WGS84).")
    parser.add_argument("--method", choices=["geoboundaries", "gadm"], default="geoboundaries",
                        help="Data source to use. Default: geoboundaries")
    parser.add_argument("--out", default="india_taluka_centroids.csv", help="Output CSV path")
    args = parser.parse_args()

    df = build(method=args.method)
    # Write CSV without index
    df.to_csv(args.out, index=False, encoding="utf-8")
    print(f"Wrote {len(df):,} rows to {args.out}")


if __name__ == "__main__":
    main()
