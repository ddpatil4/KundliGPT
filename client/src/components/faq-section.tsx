import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqData = [
  {
    id: "accuracy",
    question: "क्या यह कुंडली पूरी तरह सटीक है?",
    answer: "यह एक सामान्यीकृत विश्लेषण है जो आधुनिक तकनीक का उपयोग करके बनाया गया है। यह मार्गदर्शन प्रदान करता है लेकिन 100% सटीकता का दावा नहीं करता।"
  },
  {
    id: "decisions",
    question: "क्या मैं इस रिपोर्ट के आधार पर जीवन के महत्वपूर्ण निर्णय ले सकता हूं?",
    answer: "नहीं, यह केवल मार्गदर्शन के लिए है। जीवन के महत्वपूर्ण निर्णयों के लिए हमेशा विशेषज्ञों से सलाह लें और अपनी बुद्धि का उपयोग करें।"
  },
  {
    id: "free",
    question: "क्या यह सेवा पूरी तरह मुफ्त है?",
    answer: "हां, यह बुनियादी सेवा मुफ्त है। हमारा उद्देश्य लोगों को उपयोगी मार्गदर्शन प्रदान करना है।"
  },
  {
    id: "privacy",
    question: "मेरी व्यक्तिगत जानकारी कितनी सुरक्षित है?",
    answer: "हम आपकी गोपनीयता का पूरा सम्मान करते हैं। आपकी जानकारी केवल कुंडली बनाने के लिए उपयोग की जाती है और किसी तीसरे पक्ष के साथ साझा नहीं की जाती।"
  },
  {
    id: "revisit",
    question: "क्या मैं अपनी कुंडली को दोबारा देख सकता हूं?",
    answer: "हां, आप अपनी कुंडली को कॉपी कर सकते हैं या PDF के रूप में डाउनलोड कर सकते हैं। यह जानकारी आपके ब्राउज़र में सहेजी जाती है।"
  },
  {
    id: "traditional",
    question: "क्या यह पारंपरिक कुंडली का विकल्प है?",
    answer: "यह पारंपरिक कुंडली का पूरा विकल्प नहीं है। यह आधुनिक तकनीक के साथ सामान्य मार्गदर्शन प्रदान करता है। विस्तृत ज्योतिषीय सलाह के लिए पारंपरिक ज्योतिषी से मिलें।"
  }
];

export default function FAQSection() {
  return (
    <section id="faq" className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold hindi-text text-foreground">अक्सर पूछे जाने वाले प्रश्न</h2>
        <p className="text-muted-foreground hindi-text">आपके मन में आने वाले सामान्य प्रश्नों के उत्तर</p>
      </div>
      
      <div className="bg-card rounded-2xl p-6 md:p-8 card-shadow">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqData.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="border-border">
              <AccordionTrigger className="font-medium hindi-text text-foreground hover:text-primary transition-colors text-left" data-testid={`faq-trigger-${faq.id}`}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground hindi-text leading-relaxed" data-testid={`faq-content-${faq.id}`}>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* FAQ Schema */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </section>
  );
}
