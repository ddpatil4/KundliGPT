import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, kundliFormSchema } from "@shared/schema";
import OpenAI from "openai";

// In-memory rate limiter
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 10;

  const userLimit = rateLimiter.get(ip);
  if (!userLimit || now > userLimit.resetTime) {
    rateLimiter.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
  });

  // Kundli interpretation API
  app.post("/api/interpret", async (req, res) => {
    try {
      const clientIp = req.ip || req.connection.remoteAddress || "unknown";
      
      if (!checkRateLimit(clientIp)) {
        return res.status(429).json({ 
          ok: false, 
          error: "बहुत अधिक अनुरोध। कृपया 10 मिनट बाद पुनः प्रयास करें।" 
        });
      }

      const formData = kundliFormSchema.parse(req.body);
      
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          ok: false,
          error: "सेवा अस्थायी रूप से अनुपलब्ध है। कृपया बाद में पुनः प्रयास करें।"
        });
      }

      const languageConfig = {
        hi: {
          systemPrompt: "आप एक सहायक ज्योतिषीय गाइड हैं। जन्म की जानकारी के आधार पर व्यावहारिक जीवन मार्गदर्शन प्रदान करें। 8 प्रश्नों के संक्षिप्त उत्तर दें।",
          questionFormat: "हिंदी में उत्तर दें"
        },
        en: {
          systemPrompt: "You are a helpful life guidance counselor. Provide practical insights based on birth information. Answer 8 questions briefly.",
          questionFormat: "Answer in English"
        },
        mr: {
          systemPrompt: "तुम्ही एक उपयुक्त जीवन मार्गदर्शक आहात. जन्माच्या माहितीवर आधारित व्यावहारिक सल्ला द्या. ८ प्रश्नांची उत्तरे द्या.",
          questionFormat: "मराठी मध्ये उत्तर द्या"
        }
      };

      const selectedLanguage = formData.language || 'hi';
      const config = languageConfig[selectedLanguage as keyof typeof languageConfig];

      const questions = {
        hi: [
          "व्यक्तित्व कैसा है?",
          "करियर के लिए सुझाव?", 
          "शादी कब होगी?",
          "कौन सा ग्रह प्रभाव डाल रहा है?",
          "साढ़ेसाती की स्थिति?",
          "शक्ति और कमजोरी?",
          "पैसे के मामले में कैसा रहेगा?",
          "कौन से उपाय करने चाहिए?"
        ],
        en: [
          "What is the personality like?",
          "Career suggestions?",
          "When will marriage happen?", 
          "Which planet is influencing?",
          "Saturn period status?",
          "Strengths and weaknesses?",
          "How will finances be?",
          "What remedies should be done?"
        ],
        mr: [
          "व्यक्तिमत्व कसे आहे?",
          "करिअरसाठी सूचना?",
          "लग्न केव्हा होईल?",
          "कोणता ग्रह प्रभाव टाकत आहे?",
          "शनि काळाची स्थिती?", 
          "शक्ती आणि कमकुवतपणा?",
          "पैशाच्या बाबतीत कसे असेल?",
          "कोणते उपाय करावेत?"
        ]
      };

      const selectedQuestions = questions[selectedLanguage as keyof typeof questions];
      
      const userPrompt = `Birth Details: ${formData.name}, ${formData.birthDate}, ${formData.birthTime}, ${formData.birthPlace}

${config.questionFormat}. Answer ONLY these 8 questions with practical life guidance. Do NOT add any FAQ section or additional content:

1. ${selectedQuestions[0]}
2. ${selectedQuestions[1]}  
3. ${selectedQuestions[2]}
4. ${selectedQuestions[3]}
5. ${selectedQuestions[4]}
6. ${selectedQuestions[5]}
7. ${selectedQuestions[6]}
8. ${selectedQuestions[7]}

IMPORTANT: Return ONLY HTML without any markdown formatting or code blocks. Use <h2> tags for questions and <p> tags for answers. Do NOT include any FAQ section or additional questions.`;

      // Try gpt-4o first as fallback since gpt-5 might have issues
      console.log("Making OpenAI request with prompt length:", userPrompt.length);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: config.systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      });

      let resultHtml = response.choices[0].message.content;

      // Check if we got a valid response
      if (!resultHtml || resultHtml.trim() === '') {
        console.error("Empty response from OpenAI");
        return res.status(500).json({ 
          ok: false, 
          error: "AI सेवा से खाली उत्तर मिला। कृपया पुनः प्रयास करें।" 
        });
      }

      // Clean up HTML code blocks and markdown formatting
      resultHtml = resultHtml.replace(/```html\n?/g, '');
      resultHtml = resultHtml.replace(/```\n?$/g, '');
      resultHtml = resultHtml.replace(/^```.*\n?/gm, '');
      resultHtml = resultHtml.replace(/```$/gm, '');

      // Remove any FAQ sections that might still appear
      resultHtml = resultHtml.replace(/.*अक्सर पूछे जाने वाले प्रश्न.*/gi, '');
      resultHtml = resultHtml.replace(/.*frequently asked questions.*/gi, '');
      resultHtml = resultHtml.replace(/.*faq.*/gi, '');
      
      resultHtml = resultHtml.trim();

      console.log("OpenAI response length:", resultHtml.length);
      res.json({ ok: true, resultHtml });
    } catch (error) {
      console.error("Error in /api/interpret:", error);
      res.status(500).json({ 
        ok: false, 
        error: "कुछ तकनीकी समस्या हुई है। कृपया पुनः प्रयास करें।" 
      });
    }
  });

  // Contact form API
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactMessageSchema.parse(req.body);
      
      const message = await storage.createContactMessage(contactData);
      console.log("New contact message:", message);
      
      res.json({ ok: true, message: "आपका संदेश सफलतापूर्वक भेजा गया है।" });
    } catch (error) {
      console.error("Error in /api/contact:", error);
      res.status(500).json({ 
        ok: false, 
        error: "संदेश भेजने में समस्या हुई। कृपया पुनः प्रयास करें।" 
      });
    }
  });

  // Sitemap
  app.get("/sitemap.xml", (req, res) => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${req.get('host')}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://${req.get('host')}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://${req.get('host')}/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://${req.get('host')}/privacy</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://${req.get('host')}/terms</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.5</priority>
  </url>
</urlset>`;
    
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  const httpServer = createServer(app);
  return httpServer;
}
