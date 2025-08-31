import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ResultsDisplayProps {
  resultHtml: string;
  userInfo: {
    name: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
  };
  onBack: () => void;
}

export default function ResultsDisplay({ resultHtml, userInfo, onBack }: ResultsDisplayProps) {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = resultHtml;
      const textContent = tempDiv.textContent || '';
      
      await navigator.clipboard.writeText(textContent);
      toast({
        title: "कॉपी हो गया!",
        description: "कुंडली रिपोर्ट सफलतापूर्वक कॉपी की गई है।",
      });
    } catch (error) {
      toast({
        title: "कॉपी नहीं हो सका",
        description: "कृपया मैन्युअल रूप से टेक्स्ट सेलेक्ट करें।",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <section className="space-y-6">
      {/* Results Header */}
      <div className="bg-card rounded-2xl p-6 md:p-8 card-shadow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold hindi-text text-foreground">
              {userInfo.name} की कुंडली रिपोर्ट
            </h2>
            <p className="text-muted-foreground hindi-text">व्यावहारिक मार्गदर्शन और जीवन सुझाव</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>जन्म: {userInfo.birthDate} | समय: {userInfo.birthTime}</p>
              {userInfo.birthPlace && <p>स्थान: {userInfo.birthPlace}</p>}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 no-print">
            <Button 
              variant="outline"
              onClick={onBack}
              className="hindi-text border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              data-testid="button-back"
            >
              ← वापस जाएं
            </Button>
            
            <Button 
              variant="secondary"
              onClick={handleCopy}
              className="hindi-text"
              data-testid="button-copy"
            >
              कॉपी करें
            </Button>
            
            <Button 
              onClick={handleDownload}
              className="hindi-text bg-accent hover:bg-accent/90"
              data-testid="button-download"
            >
              PDF डाउनलोड
            </Button>
          </div>
        </div>
      </div>

      {/* Result Content */}
      <div 
        className="space-y-6"
        dangerouslySetInnerHTML={{ __html: resultHtml }}
        data-testid="results-content"
      />
    </section>
  );
}
