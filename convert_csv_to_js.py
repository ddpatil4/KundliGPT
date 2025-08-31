#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import json

def convert_csv_to_js_cities(csv_file, output_file):
    # Read the CSV file
    df = pd.read_csv(csv_file)
    
    # Create JavaScript array format
    js_cities = []
    
    for _, row in df.iterrows():
        state = str(row['State']).strip()
        district = str(row['District']).strip() 
        taluka = str(row['Taluka/Tehsil']).strip()
        lat = float(row['Latitude'])
        lng = float(row['Longitude'])
        
        # Skip rows with invalid data
        if state == 'nan' or district == 'nan' or taluka == 'nan':
            continue
            
        # Use taluka as the city name
        city_name = taluka
        
        # Create Hindi state names mapping
        state_hindi_map = {
            'Andhra Pradesh': 'आंध्र प्रदेश',
            'Arunachal Pradesh': 'अरुणाचल प्रदेश', 
            'Assam': 'असम',
            'Bihar': 'बिहार',
            'Chhattisgarh': 'छत्तीसगढ़',
            'Goa': 'गोवा',
            'Gujarat': 'गुजरात',
            'Haryana': 'हरियाणा',
            'Himachal Pradesh': 'हिमाचल प्रदेश',
            'Jammu and Kashmir': 'जम्मू और कश्मीर',
            'Jharkhand': 'झारखंड',
            'Karnataka': 'कर्नाटक',
            'Kerala': 'केरल',
            'Madhya Pradesh': 'मध्य प्रदेश',
            'Maharashtra': 'महाराष्ट्र',
            'Manipur': 'मणिपुर',
            'Meghalaya': 'मेघालय',
            'Mizoram': 'मिजोरम',
            'Nagaland': 'नागालैंड',
            'Odisha': 'ओडिशा',
            'Punjab': 'पंजाब',
            'Rajasthan': 'राजस्थान',
            'Sikkim': 'सिक्किम',
            'Tamil Nadu': 'तमिल नाडु',
            'Telangana': 'तेलंगाना',
            'Tripura': 'त्रिपुरा',
            'Uttar Pradesh': 'उत्तर प्रदेश',
            'Uttarakhand': 'उत्तराखंड',
            'West Bengal': 'पश्चिम बंगाल',
            'Andaman and Nicobar': 'अंडमान और निकोबार',
            'Chandigarh': 'चंडीगढ़',
            'Dadra and Nagar Haveli and Daman and Diu': 'दादरा और नगर हवेली और दमन और दीव',
            'Delhi': 'दिल्ली',
            'Lakshadweep': 'लक्षद्वीप',
            'Puducherry': 'पुदुचेरी',
            'Ladakh': 'लद्दाख'
        }
        
        state_hindi = state_hindi_map.get(state, state)
        
        # For city Hindi names, just use the English name for now
        # In a real implementation, you might want to add Hindi translations
        city_hindi = city_name
        
        city_obj = {
            'name': city_name,
            'nameHindi': city_hindi,
            'state': state,
            'stateHindi': state_hindi,
            'latitude': lat,
            'longitude': lng
        }
        
        js_cities.append(city_obj)
    
    # Generate JavaScript export string
    js_content = f"""export interface City {{
  name: string;
  nameHindi: string;
  state: string;
  stateHindi: string;
  latitude: number;
  longitude: number;
}}

export const cities: City[] = [
"""
    
    for i, city in enumerate(js_cities):
        name = city['name'].replace('"', '\\"')
        nameHindi = city['nameHindi'].replace('"', '\\"')
        state = city['state'].replace('"', '\\"')
        stateHindi = city['stateHindi'].replace('"', '\\"')
        
        js_content += f'  {{ name: "{name}", nameHindi: "{nameHindi}", state: "{state}", stateHindi: "{stateHindi}", latitude: {city["latitude"]}, longitude: {city["longitude"]} }}'
        
        if i < len(js_cities) - 1:
            js_content += ","
        js_content += "\n"
    
    js_content += "];\n"
    
    # Write to output file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"Converted {len(js_cities)} cities to {output_file}")

if __name__ == "__main__":
    convert_csv_to_js_cities("india_taluka_centroids_gadm.csv", "cities_comprehensive.ts")