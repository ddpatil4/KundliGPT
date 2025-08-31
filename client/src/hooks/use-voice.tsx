import { useState, useEffect, useCallback } from 'react';

interface VoiceSettings {
  rate: number;
  pitch: number;
  volume: number;
  language: string;
}

interface UseVoiceReturn {
  isPlaying: boolean;
  isPaused: boolean;
  isSupported: boolean;
  speak: (text: string, language?: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  settings: VoiceSettings;
  updateSettings: (newSettings: Partial<VoiceSettings>) => void;
  availableVoices: SpeechSynthesisVoice[];
}

export const useVoice = (): UseVoiceReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  
  const [settings, setSettings] = useState<VoiceSettings>({
    rate: 0.9,
    pitch: 1,
    volume: 0.8,
    language: 'hi-IN'
  });

  // Check if speech synthesis is supported
  useEffect(() => {
    const supported = 'speechSynthesis' in window;
    setIsSupported(supported);

    if (supported) {
      // Load available voices
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };

      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Clean up speech when component unmounts
  useEffect(() => {
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const getVoiceForLanguage = useCallback((language: string): SpeechSynthesisVoice | null => {
    if (availableVoices.length === 0) return null;

    // Try to find a voice for the specific language
    let voice = availableVoices.find(v => v.lang.startsWith(language));
    
    // Fallback voices for Hindi
    if (!voice && language.startsWith('hi')) {
      voice = availableVoices.find(v => 
        v.lang.includes('hi') || 
        v.name.toLowerCase().includes('hindi') ||
        v.name.toLowerCase().includes('india')
      );
    }
    
    // Fallback voices for English
    if (!voice && language.startsWith('en')) {
      voice = availableVoices.find(v => 
        v.lang.startsWith('en-') || 
        v.name.toLowerCase().includes('english')
      );
    }

    // Last resort - use default voice
    return voice || availableVoices[0] || null;
  }, [availableVoices]);

  const improveHindiPronunciation = useCallback((text: string): string => {
    return text
      // Fix common Hindi pronunciation issues
      .replace(/ृ/g, 'रि') // Fix र्‍ combination
      .replace(/क्ष/g, 'क्ष ') // Add space after complex consonants
      .replace(/ज्ञ/g, 'ज्ञ ')
      .replace(/श्र/g, 'श्र ')
      // Add slight pauses for better pronunciation
      .replace(/\।/g, '। ') // Devanagari full stop
      .replace(/\,/g, ', ') // Comma pause
      .replace(/\?/g, '? ') // Question mark pause
      .replace(/\!/g, '! ') // Exclamation pause
      // Numbers in Hindi context
      .replace(/(\d+)/g, ' $1 ') // Add spaces around numbers
      .replace(/\s+/g, ' ') // Clean multiple spaces
      .trim();
  }, []);

  const speak = useCallback((text: string, language?: string) => {
    if (!isSupported || !text.trim()) return;

    // Stop any ongoing speech
    speechSynthesis.cancel();

    // Clean the text for better pronunciation
    let cleanText = text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\d+\./g, '') // Remove numbering
      .replace(/\s+/g, ' ') // Clean multiple spaces
      .trim();

    if (!cleanText) return;

    const targetLanguage = language || settings.language;
    
    // Apply Hindi-specific improvements
    if (targetLanguage.startsWith('hi')) {
      cleanText = improveHindiPronunciation(cleanText);
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Set voice properties
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;
    utterance.lang = targetLanguage;

    // Find and set appropriate voice
    const voice = getVoiceForLanguage(targetLanguage);
    if (voice) {
      utterance.voice = voice;
    }

    // Set up event listeners
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentUtterance(null);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentUtterance(null);
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    setCurrentUtterance(utterance);
    speechSynthesis.speak(utterance);
  }, [isSupported, settings, getVoiceForLanguage, improveHindiPronunciation]);

  const pause = useCallback(() => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    }
  }, []);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentUtterance(null);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    isPlaying,
    isPaused,
    isSupported,
    speak,
    pause,
    resume,
    stop,
    settings,
    updateSettings,
    availableVoices
  };
};