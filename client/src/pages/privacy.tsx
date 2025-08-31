import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Privacy() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-screen-md mx-auto px-4 py-8">
        <div className="bg-card rounded-2xl p-6 md:p-8 card-shadow space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold hindi-text text-foreground">गोपनीयता नीति</h1>
            <p className="text-muted-foreground hindi-text">अंतिम अपडेट: 31 अगस्त, 2024</p>
          </div>

          <div className="space-y-6 hindi-text text-foreground leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">जानकारी संग्रह</h2>
              <p>हम केवल वह जानकारी एकत्र करते हैं जो कुंडली सेवा प्रदान करने के लिए आवश्यक है:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>नाम और जन्म विवरण (तिथि, समय, स्थान)</li>
                <li>ब्राउज़र और डिवाइस की बुनियादी जानकारी</li>
                <li>IP पता (सुरक्षा और दर दर सीमा के लिए)</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">जानकारी का उपयोग</h2>
              <p>आपकी जानकारी का उपयोग केवल निम्नलिखित उद्देश्यों के लिए किया जाता है:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>कुंडली रिपोर्ट तैयार करना</li>
                <li>सेवा की गुणवत्ता में सुधार</li>
                <li>तकनीकी सहायता प्रदान करना</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">डेटा साझाकरण</h2>
              <p>हम आपकी व्यक्तिगत जानकारी किसी तीसरे पक्ष के साथ साझा नहीं करते हैं। आपका डेटा केवल कुंडली सेवा के लिए उपयोग किया जाता है।</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">डेटा सुरक्षा</h2>
              <p>हम आपकी जानकारी की सुरक्षा के लिए उद्योग-मानक उपाय करते हैं। हालांकि, इंटरनेट पर कोई भी प्रणाली 100% सुरक्षित नहीं हो सकती।</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">कुकीज़</h2>
              <p>हम केवल आवश्यक कुकीज़ का उपयोग करते हैं जो वेबसाइट के सामान्य कार्यप्रणाली के लिए जरूरी हैं।</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">संपर्क</h2>
              <p>गोपनीयता संबंधी किसी भी प्रश्न के लिए हमसे संपर्क करें: support@hindikundli.com</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
