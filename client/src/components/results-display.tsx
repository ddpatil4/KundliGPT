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

  // Format date from YYYY-MM-DD to DD Month YYYY
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const months = [
      'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
      'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Format time from 24-hour to 12-hour AM/PM
  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

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
      {/* Traditional Kundli Header */}
      <div className="kundli-header no-print">
        <h1 className="kundli-title hindi-text">जन्म कुंडली</h1>
        <p className="kundli-subtitle hindi-text">व्यावहारिक मार्गदर्शन और जीवन सुझाव</p>
      </div>

      {/* Results Header */}
      <div className="bg-card rounded-2xl p-6 md:p-8 card-shadow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold hindi-text text-foreground">
              {userInfo.name} की कुंडली रिपोर्ट
            </h2>
            <p className="text-muted-foreground hindi-text">व्यावहारिक मार्गदर्शन और जीवन सुझाव</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>जन्म: {formatDate(userInfo.birthDate)} | समय: {formatTime(userInfo.birthTime)}</p>
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

      {/* Traditional PDF Layout */}
      <div className="kundli-content">
        {/* Person Info for PDF */}
        <div className="person-info">
          <h3 className="hindi-text">{userInfo.name}</h3>
          <p>जन्म तिथि: {formatDate(userInfo.birthDate)}</p>
          <p>जन्म समय: {formatTime(userInfo.birthTime)}</p>
          {userInfo.birthPlace && <p>जन्म स्थान: {userInfo.birthPlace}</p>}
        </div>

        {/* Result Content with Traditional Styling */}
        <div 
          className="kundli-sections space-y-6"
          dangerouslySetInnerHTML={{ 
            __html: resultHtml
          }}
          data-testid="results-content"
        />
        
        {/* Traditional Footer */}
        <div className="kundli-footer">
          <p>यह केवल मार्गदर्शन हेतु है। किसी भी महत्वपूर्ण निर्णय से पहले योग्य सलाहकार से सम्पर्क करें।</p>
        </div>
      </div>
    </section>
  );
}
