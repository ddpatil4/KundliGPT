import Header from "@/components/header";
import Footer from "@/components/footer";

export default function About() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-screen-md mx-auto px-4 py-8">
        <div className="bg-card rounded-2xl p-6 md:p-8 card-shadow space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold hindi-text text-foreground">हमारे बारे में</h1>
            <p className="text-lg text-muted-foreground hindi-text">आधुनिक तकनीक के साथ पारंपरिक ज्ञान</p>
          </div>

          <div className="space-y-6 hindi-text text-foreground leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">हमारा उद्देश्य</h2>
              <p>
                हिंदी कुंडली एक आधुनिक वेब एप्लिकेशन है जो पारंपरिक ज्योतिष ज्ञान को समकालीन तकनीक के साथ जोड़कर 
                व्यावहारिक मार्गदर्शन प्रदान करती है। हमारा लक्ष्य लोगों को जीवन की दिशा में सहायक सुझाव देना है।
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">हमारा दृष्टिकोण</h2>
              <p>
                हम मानते हैं कि ज्योतिष एक मार्गदर्शन का साधन है, न कि निश्चित भविष्यवाणी का। हमारी सेवा 
                व्यावहारिक और जिम्मेदार सुझाव देती है जो व्यक्ति के विकास में सहायक हो सकते हैं।
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">तकनीकी विशेषताएं</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>आधुनिक AI तकनीक का उपयोग</li>
                <li>मोबाइल-फ्रेंडली डिजाइन</li>
                <li>तेज़ और सुरक्षित सेवा</li>
                <li>उपयोगकर्ता की गोपनीयता का सम्मान</li>
                <li>निःशुल्क बुनियादी सेवाएं</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">महत्वपूर्ण सूचना</h2>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-destructive/80">
                  यह सेवा केवल मार्गदर्शन के लिए है। स्वास्थ्य, वित्तीय, या कानूनी मामलों में हमेशा योग्य विशेषज्ञों से सलाह लें। 
                  हम किसी भी प्रकार की गारंटी या निश्चित भविष्यवाणी का दावा नहीं करते हैं।
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">हमसे जुड़ें</h2>
              <p>
                सुझाव, शिकायत, या किसी भी प्रकार की सहायता के लिए हमसे संपर्क करें। हम आपकी प्रतिक्रिया का स्वागत करते हैं 
                और निरंतर सेवा में सुधार के लिए प्रतिबद्ध हैं।
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
