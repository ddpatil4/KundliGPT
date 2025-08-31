import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t mt-16 no-print">
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
                <span className="text-primary-foreground font-bold hindi-text">कु</span>
              </div>
              <span className="font-semibold hindi-text">हिंदी कुंडली</span>
            </div>
            <p className="text-muted-foreground hindi-text text-sm leading-relaxed">
              आधुनिक तकनीक के साथ पारंपरिक ज्ञान का संयोजन। विश्वसनीय और व्यावहारिक मार्गदर्शन।
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold hindi-text text-foreground">महत्वपूर्ण लिंक</h4>
            <nav className="space-y-2">
              <Link href="/privacy" className="block text-muted-foreground hover:text-foreground transition-colors hindi-text text-sm" data-testid="link-privacy">
                गोपनीयता नीति
              </Link>
              <Link href="/terms" className="block text-muted-foreground hover:text-foreground transition-colors hindi-text text-sm" data-testid="link-terms">
                सेवा की शर्तें
              </Link>
              <Link href="/about" className="block text-muted-foreground hover:text-foreground transition-colors hindi-text text-sm" data-testid="link-about-footer">
                हमारे बारे में
              </Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-foreground transition-colors hindi-text text-sm" data-testid="link-contact-footer">
                संपर्क करें
              </Link>
            </nav>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold hindi-text text-foreground">संपर्क</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="hindi-text">सहायता के लिए संपर्क करें</p>
              <p>support@hindikundli.com</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-muted-foreground text-sm hindi-text">
            © 2024 हिंदी कुंडली। सभी अधिकार सुरक्षित। केवल मार्गदर्शन के लिए।
          </p>
        </div>
      </div>
    </footer>
  );
}
