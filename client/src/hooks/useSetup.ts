import { useQuery } from "@tanstack/react-query";

export function useSetup() {
  const { data: setupStatus, isLoading } = useQuery({
    queryKey: ["/api/setup/status"],
    retry: false,
  });

  return {
    isSetupComplete: setupStatus?.isSetupComplete || false,
    siteName: setupStatus?.siteName || "Hindi Kundli Insight",
    isLoading,
  };
}

export function useSiteConfig() {
  const { data: config, isLoading } = useQuery({
    queryKey: ["/api/site-config"],
    retry: false,
  });

  return {
    siteName: config?.siteName || "Hindi Kundli Insight",
    siteDescription: config?.siteDescription || "Get personalized Hindi astrological guidance and kundli insights",
    siteKeywords: config?.siteKeywords || "kundli, astrology, hindi, horoscope, jyotish, राशिफल",
    isLoading,
  };
}