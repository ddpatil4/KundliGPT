export interface City {
  name: string;
  nameHindi: string;
  state: string;
  stateHindi: string;
  latitude: number;
  longitude: number;
}

export const indianCities: City[] = [
  { name: "Mumbai", nameHindi: "मुंबई", state: "Maharashtra", stateHindi: "महाराष्ट्र", latitude: 19.0760, longitude: 72.8777 },
  { name: "Delhi", nameHindi: "दिल्ली", state: "Delhi", stateHindi: "दिल्ली", latitude: 28.7041, longitude: 77.1025 },
  { name: "Bangalore", nameHindi: "बेंगलुरु", state: "Karnataka", stateHindi: "कर्नाटक", latitude: 12.9716, longitude: 77.5946 },
  { name: "Kolkata", nameHindi: "कोलकाता", state: "West Bengal", stateHindi: "पश्चिम बंगाल", latitude: 22.5726, longitude: 88.3639 },
  { name: "Chennai", nameHindi: "चेन्नई", state: "Tamil Nadu", stateHindi: "तमिलनाडु", latitude: 13.0827, longitude: 80.2707 },
  { name: "Hyderabad", nameHindi: "हैदराबाद", state: "Telangana", stateHindi: "तेलंगाना", latitude: 17.3850, longitude: 78.4867 },
  { name: "Pune", nameHindi: "पुणे", state: "Maharashtra", stateHindi: "महाराष्ट्र", latitude: 18.5204, longitude: 73.8567 },
  { name: "Ahmedabad", nameHindi: "अहमदाबाद", state: "Gujarat", stateHindi: "गुजरात", latitude: 23.0225, longitude: 72.5714 },
  { name: "Jaipur", nameHindi: "जयपुर", state: "Rajasthan", stateHindi: "राजस्थान", latitude: 26.9124, longitude: 75.7873 },
  { name: "Surat", nameHindi: "सूरत", state: "Gujarat", stateHindi: "गुजरात", latitude: 21.1702, longitude: 72.8311 },
  { name: "Lucknow", nameHindi: "लखनऊ", state: "Uttar Pradesh", stateHindi: "उत्तर प्रदेश", latitude: 26.8467, longitude: 80.9462 },
  { name: "Kanpur", nameHindi: "कानपुर", state: "Uttar Pradesh", stateHindi: "उत्तर प्रदेश", latitude: 26.4499, longitude: 80.3319 },
  { name: "Nagpur", nameHindi: "नागपुर", state: "Maharashtra", stateHindi: "महाराष्ट्र", latitude: 21.1458, longitude: 79.0882 },
  { name: "Indore", nameHindi: "इंदौर", state: "Madhya Pradesh", stateHindi: "मध्य प्रदेश", latitude: 22.7196, longitude: 75.8577 },
  { name: "Thane", nameHindi: "ठाणे", state: "Maharashtra", stateHindi: "महाराष्ट्र", latitude: 19.2183, longitude: 72.9781 },
  { name: "Bhopal", nameHindi: "भोपाल", state: "Madhya Pradesh", stateHindi: "मध्य प्रदेश", latitude: 23.2599, longitude: 77.4126 },
  { name: "Visakhapatnam", nameHindi: "विशाखापत्तनम", state: "Andhra Pradesh", stateHindi: "आंध्र प्रदेश", latitude: 17.6868, longitude: 83.2185 },
  { name: "Pimpri-Chinchwad", nameHindi: "पिंपरी-चिंचवड", state: "Maharashtra", stateHindi: "महाराष्ट्र", latitude: 18.6298, longitude: 73.7997 },
  { name: "Patna", nameHindi: "पटना", state: "Bihar", stateHindi: "बिहार", latitude: 25.5941, longitude: 85.1376 },
  { name: "Vadodara", nameHindi: "वडोदरा", state: "Gujarat", stateHindi: "गुजरात", latitude: 22.3072, longitude: 73.1812 },
];

export function searchCities(query: string): City[] {
  if (!query.trim()) return indianCities.slice(0, 8);
  
  const searchTerm = query.toLowerCase();
  return indianCities.filter(city => 
    city.name.toLowerCase().includes(searchTerm) ||
    city.nameHindi.includes(query) ||
    city.state.toLowerCase().includes(searchTerm) ||
    city.stateHindi.includes(query)
  ).slice(0, 8);
}
