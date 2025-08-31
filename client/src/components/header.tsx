import { Link } from "wouter";
import LanguageSwitcher from "@/components/language-switcher";
import { useLanguage } from "@/hooks/use-language";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-card shadow-sm border-b sticky top-0 z-50 no-print">
      <div className="max-w-screen-lg mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3" data-testid="link-home">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg hindi-text">कु</span>
            </div>
            <h1 className="text-xl font-semibold hindi-text">{t('title')}</h1>
          </Link>
          
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors hindi-text" data-testid="link-main">
                मुख्य
              </Link>
              <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors hindi-text" data-testid="link-blog">
                ब्लॉग
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors hindi-text" data-testid="link-about">
                हमारे बारे में
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors hindi-text" data-testid="link-contact">
                संपर्क
              </Link>
            </nav>
            
            <LanguageSwitcher 
              currentLanguage={language} 
              onLanguageChange={setLanguage} 
            />
          </div>
        </div>
      </div>
    </header>
  );
}
