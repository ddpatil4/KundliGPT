import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Terms() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-screen-md mx-auto px-4 py-8">
        <div className="bg-card rounded-2xl p-6 md:p-8 card-shadow space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold hindi-text text-foreground">सेवा की शर्तें</h1>
            <p className="text-muted-foreground hindi-text">अंतिम अपडेट: 31 अगस्त, 2024</p>
          </div>

          <div className="space-y-6 hindi-text text-foreground leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">सेवा की स्वीकृति</h2>
              <p>इस वेबसाइट का उपयोग करके आप इन शर्तों से सहमत होते हैं। यदि आप सहमत नहीं हैं, तो कृपया इस सेवा का उपयोग न करें।</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">सेवा का विवरण</h2>
              <p>यह सेवा मार्गदर्शन के उद्देश्य से कुंडली-आधारित सुझाव प्रदान करती है। यह निम्नलिखित नहीं है:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>चिकित्सा सलाह या उपचार</li>
                <li>वित्तीय सलाह या निवेश मार्गदर्शन</li>
                <li>कानूनी सलाह</li>
                <li>निश्चित भविष्यवाणी या गारंटी</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">उपयोगकर्ता की जिम्मेदारियां</h2>
              <ul className="list-disc ml-6 space-y-1">
                <li>सटीक जानकारी प्रदान करें</li>
                <li>सेवा का दुरुपयोग न करें</li>
                <li>महत्वपूर्ण निर्णयों के लिए विशेषज्ञों से सलाह लें</li>
                <li>अन्य उपयोगकर्ताओं का सम्मान करें</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">अस्वीकरण</h2>
              <p>यह सेवा केवल मार्गदर्शन के लिए है। हम किसी भी प्रकार की गारंटी नहीं देते हैं। उपयोगकर्ता अपनी जिम्मेदारी पर इस सेवा का उपयोग करता है।</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">सेवा में परिवर्तन</h2>
              <p>हम बिना पूर्व सूचना के सेवा में परिवर्तन कर सकते हैं। महत्वपूर्ण परिवर्तनों की सूचना वेबसाइट पर दी जाएगी।</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">संपर्क</h2>
              <p>शर्तों के बारे में किसी भी प्रश्न के लिए हमसे संपर्क करें: support@hindikundli.com</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
