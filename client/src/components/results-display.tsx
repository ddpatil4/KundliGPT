import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useVoice } from "@/hooks/use-voice";
import VoiceSettings from "@/components/voice-settings";
import { Play, Pause, Square, Volume2, VolumeX } from "lucide-react";

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
  const { isPlaying, isPaused, isSupported, speak, pause, resume, stop } = useVoice();

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

  const handleVoicePlay = () => {
    try {
      if (isPlaying && !isPaused) {
        pause();
      } else if (isPaused) {
        resume();
      } else {
        // Extract text content and detect language
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = resultHtml;
        const textContent = tempDiv.textContent || '';
        
        if (!textContent.trim()) {
          toast({
            title: "कोई टेक्स्ट नहीं मिला",
            description: "सुनने के लिए कोई सामग्री नहीं है।",
          });
          return;
        }
        
        // Simple language detection based on content
        const hasHindi = /[\u0900-\u097F]/.test(textContent);
        const language = hasHindi ? 'hi-IN' : 'en-US';
        
        speak(textContent, language);
      }
    } catch (error) {
      console.log('Error in voice play handler:', error);
      toast({
        title: "आवाज़ एरर",
        description: "आवाज़ प्ले करने में समस्या हुई।",
        variant: "destructive"
      });
    }
  };

  const handleVoiceStop = () => {
    try {
      stop();
    } catch (error) {
      console.log('Error stopping voice:', error);
      toast({
        title: "आवाज़ एरर",
        description: "आवाज़ बंद करने में समस्या हुई।",
        variant: "destructive"
      });
    }
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

            {isSupported && (
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVoicePlay}
                  className="gap-1"
                  data-testid="button-voice-play"
                  title={isPlaying && !isPaused ? "आवाज़ रोकें" : isPaused ? "आवाज़ जारी रखें" : "आवाज़ में सुनें"}
                >
                  {isPlaying && !isPaused ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline hindi-text">
                    {isPlaying && !isPaused ? "रोकें" : isPaused ? "जारी" : "सुनें"}
                  </span>
                </Button>
                
                {isPlaying && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleVoiceStop}
                    className="gap-1"
                    data-testid="button-voice-stop"
                    title="आवाज़ बंद करें"
                  >
                    <Square className="h-4 w-4" />
                    <span className="hidden sm:inline hindi-text">बंद</span>
                  </Button>
                )}
                
                <VoiceSettings />
              </div>
            )}
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
          className={`kundli-sections space-y-6 ${isPlaying ? 'voice-reading' : ''}`}
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
