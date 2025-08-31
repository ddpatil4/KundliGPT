import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import KundliForm from "@/components/kundli-form";
import LoadingState from "@/components/loading-state";
import ResultsDisplay from "@/components/results-display";
import FAQSection from "@/components/faq-section";
import { type KundliFormData } from "@shared/schema";
import { useSiteConfig } from "@/hooks/useSetup";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ resultHtml: string; formData: KundliFormData } | null>(null);
  const { siteName, siteDescription, siteKeywords } = useSiteConfig();

  const handleResult = (result: any, formData: KundliFormData) => {
    setIsLoading(false);
    setResults({ resultHtml: result.resultHtml, formData });
    
    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.querySelector('[data-testid="results-content"]');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleBack = () => {
    setResults(null);
    setIsLoading(false);
    
    // Scroll back to top
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Update document title and meta tags
  useEffect(() => {
    document.title = siteName;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', siteDescription);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = siteDescription;
      document.head.appendChild(meta);
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', siteKeywords);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = siteKeywords;
      document.head.appendChild(meta);
    }
  }, [siteName, siteDescription, siteKeywords]);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-screen-md mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold hindi-text hero-gradient">
              हिंदी कुंडली—व्यावहारिक मार्गदर्शन
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground hindi-text max-w-2xl mx-auto leading-relaxed">
              आधुनिक तकनीक के साथ पारंपरिक ज्ञान का संयोजन। जीवन की दिशा और व्यावहारिक सुझाव पाएं।
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-accent" />
            <span className="hindi-text">विश्वसनीय और सुरक्षित सेवा</span>
          </div>
        </section>

        {/* Form */}
        {!isLoading && !results && (
          <KundliForm onResult={handleResult} />
        )}

        {/* Loading State */}
        {isLoading && <LoadingState />}

        {/* Results */}
        {results && (
          <ResultsDisplay 
            resultHtml={results.resultHtml}
            userInfo={{
              name: results.formData.name,
              birthDate: results.formData.birthDate,
              birthTime: results.formData.birthTime,
              birthPlace: results.formData.birthPlace || "",
            }}
            onBack={handleBack}
          />
        )}

        {/* FAQ Section */}
        {!isLoading && <FAQSection />}
      </main>

      <Footer />
    </div>
  );
}
