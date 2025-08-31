import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Settings, Volume2 } from 'lucide-react';
import { useVoice } from '@/hooks/use-voice';

export default function VoiceSettings() {
  const { settings, updateSettings, availableVoices } = useVoice();
  const [isOpen, setIsOpen] = useState(false);

  // Filter voices for Hindi and English
  const hindiVoices = availableVoices.filter(voice => 
    voice.lang.includes('hi') || 
    voice.name.toLowerCase().includes('hindi') ||
    voice.name.toLowerCase().includes('india')
  );

  const englishVoices = availableVoices.filter(voice => 
    voice.lang.startsWith('en') || 
    voice.name.toLowerCase().includes('english')
  );

  const handleRateChange = (value: number[]) => {
    updateSettings({ rate: value[0] });
  };

  const handleVolumeChange = (value: number[]) => {
    updateSettings({ volume: value[0] });
  };

  const handleLanguageChange = (language: string) => {
    updateSettings({ language });
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          data-testid="voice-settings"
          title="आवाज़ सेटिंग्स"
        >
          <Settings className="h-4 w-4" />
          <Volume2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-4">
        <DropdownMenuLabel className="hindi-text">आवाज़ सेटिंग्स</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="space-y-4">
          {/* Speech Rate */}
          <div className="space-y-2">
            <label className="text-sm font-medium hindi-text">
              गति: {settings.rate.toFixed(1)}x
            </label>
            <Slider
              value={[settings.rate]}
              onValueChange={handleRateChange}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Volume */}
          <div className="space-y-2">
            <label className="text-sm font-medium hindi-text">
              आवाज़: {Math.round(settings.volume * 100)}%
            </label>
            <Slider
              value={[settings.volume]}
              onValueChange={handleVolumeChange}
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>

          <DropdownMenuSeparator />

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium hindi-text mb-2 block">
              भाषा चुनें:
            </label>
            
            <div className="space-y-1">
              <Button
                variant={settings.language === 'hi-IN' ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start text-sm hindi-text"
                onClick={() => handleLanguageChange('hi-IN')}
              >
                🇮🇳 हिंदी
              </Button>
              
              <Button
                variant={settings.language === 'en-US' ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => handleLanguageChange('en-US')}
              >
                🇺🇸 English
              </Button>
              
              <Button
                variant={settings.language === 'en-IN' ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => handleLanguageChange('en-IN')}
              >
                🇮🇳 Indian English
              </Button>
            </div>
          </div>

          {hindiVoices.length > 0 && settings.language.startsWith('hi') && (
            <>
              <DropdownMenuSeparator />
              <div className="space-y-2">
                <label className="text-sm font-medium hindi-text">
                  हिंदी आवाज़ें:
                </label>
                <div className="text-xs text-muted-foreground">
                  {hindiVoices.length} उपलब्ध
                </div>
              </div>
            </>
          )}

          {englishVoices.length > 0 && settings.language.startsWith('en') && (
            <>
              <DropdownMenuSeparator />
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  English Voices:
                </label>
                <div className="text-xs text-muted-foreground">
                  {englishVoices.length} available
                </div>
              </div>
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}