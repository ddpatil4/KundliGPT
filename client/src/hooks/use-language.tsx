import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'hi' | 'en' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  hi: {
    title: 'हिंदी कुंडली दृष्टि',
    subtitle: 'व्यावहारिक ज्योतिषीय मार्गदर्शन',
    name: 'नाम',
    birthDate: 'जन्म तिथि',
    birthTime: 'जन्म समय',
    birthPlace: 'जन्म स्थान',
    submit: 'कुंडली बनाएं',
    back: 'वापस जाएं',
    copy: 'कॉपी करें',
    downloadPdf: 'PDF डाउनलोड',
    searchCity: 'शहर खोजें...',
    loading: 'कुंडली तैयार की जा रही है...',
    error: 'कुछ गलत हुआ है',
    retry: 'पुनः प्रयास करें'
  },
  en: {
    title: 'Hindi Kundli Insights',
    subtitle: 'Practical Astrological Guidance',
    name: 'Name',
    birthDate: 'Birth Date',
    birthTime: 'Birth Time',
    birthPlace: 'Birth Place',
    submit: 'Generate Kundli',
    back: 'Go Back',
    copy: 'Copy',
    downloadPdf: 'Download PDF',
    searchCity: 'Search city...',
    loading: 'Preparing your kundli...',
    error: 'Something went wrong',
    retry: 'Try Again'
  },
  mr: {
    title: 'हिंदी कुंडली दर्शन',
    subtitle: 'व्यावहारिक ज्योतिषीय मार्गदर्शन',
    name: 'नाव',
    birthDate: 'जन्म तारीख',
    birthTime: 'जन्म वेळ',
    birthPlace: 'जन्म स्थान',
    submit: 'कुंडली तयार करा',
    back: 'परत जा',
    copy: 'कॉपी करा',
    downloadPdf: 'PDF डाउनलोड',
    searchCity: 'शहर शोधा...',
    loading: 'कुंडली तयार होत आहे...',
    error: 'काहीतरी चूक झाली',
    retry: 'पुन्हा प्रयत्न करा'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'hi';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}