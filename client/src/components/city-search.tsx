import { useState, useRef, useEffect } from "react";
import { searchCities, type City } from "@/lib/cities";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CitySearchProps {
  value: string;
  onChange: (value: string) => void;
  onCitySelect: (city: City) => void;
}

export default function CitySearch({ value, onChange, onCitySelect }: CitySearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const results = searchCities(value);
    setSearchResults(results);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleCityClick = (city: City) => {
    const displayName = `${city.nameHindi} (${city.name}), ${city.stateHindi}`;
    onChange(displayName);
    onCitySelect(city);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="birthPlace" className="text-sm font-medium hindi-text text-foreground">
        जन्म स्थान / Birth Place
      </Label>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          id="birthPlace"
          name="birthPlace"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className="w-full px-4 py-3 border border-input rounded-lg form-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
          placeholder="शहर का नाम खोजें / Search city name"
          data-testid="input-birthplace"
        />
        
        {isOpen && searchResults.length > 0 && (
          <div 
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 bg-card border border-input rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
            data-testid="dropdown-cities"
          >
            {searchResults.map((city, index) => (
              <div
                key={`${city.name}-${city.state}`}
                className="dropdown-item px-4 py-3 cursor-pointer hover:bg-muted transition-colors border-b border-border last:border-b-0"
                onClick={() => handleCityClick(city)}
                data-testid={`city-option-${index}`}
              >
                <div className="flex flex-col">
                  <span className="hindi-text font-medium text-foreground">{city.nameHindi} ({city.name})</span>
                  <span className="text-xs text-muted-foreground hindi-text">{city.stateHindi}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground hindi-text">
        वैकल्पिक: सटीक स्थान के लिए शहर का चयन करें
      </p>
    </div>
  );
}
