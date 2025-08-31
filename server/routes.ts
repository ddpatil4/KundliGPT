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

      const systemPrompt = "आप एक अनुभवी हिंदी ज्योतिषी हैं। Q&A format में comprehensive कुंडली विश्लेषण दें। कोई गारंटी या भविष्यवाणी न करें, केवल मार्गदर्शन दें।";

      const userPrompt = `${formData.name} की विस्तृत कुंडली विश्लेषण Q&A format में करें:

जन्म विवरण:
- नाम: ${formData.name}
- तारीख: ${formData.birthDate}  
- समय: ${formData.birthTime}
- स्थान: ${formData.birthPlace || 'दिया गया स्थान'}

निम्न प्रश्नों के उत्तर हिंदी में दें, हर section के बाद अंतर रखें:

<h2>🌟 प्रश्न 1: मेरा व्यक्तित्व कैसा है?</h2>
<p><strong>उत्तर:</strong> आपका स्वभाव [detailed personality analysis]...</p>
<br>

<h2>🏆 प्रश्न 2: मेरे लिए कौन सा करियर सबसे अच्छा होगा?</h2>
<p><strong>उत्तर:</strong> आपके लिए निम्न क्षेत्र उपयुक्त हैं:</p>
<ul>
<li>क्षेत्र 1 - कारण सहित</li>
<li>क्षेत्र 2 - कारण सहित</li>
<li>क्षेत्र 3 - कारण सहित</li>
</ul>
<br>

<h2>💍 प्रश्न 3: मेरी शादी कब होगी?</h2>
<p><strong>उत्तर:</strong> संभावित समय अवधि [वर्ष range] (केवल संकेत, गारंटी नहीं)...</p>
<br>

<h2>🌙 प्रश्न 4: अभी कौन सा ग्रह मुझ पर प्रभाव डाल रहा है?</h2>
<p><strong>उत्तर:</strong> वर्तमान में [मुख्य ग्रह] का प्रभाव है जो [effect] पैदा कर रहा है...</p>
<br>

<h2>⚡ प्रश्न 5: क्या मैं साढ़ेसाती या अष्टम शनि के दौर में हूं?</h2>
<p><strong>उत्तर:</strong> [current planetary period] की स्थिति के अनुसार [analysis]...</p>
<br>

<h2>🎯 प्रश्न 6: मेरी सबसे बड़ी शक्ति और कमजोरी क्या है?</h2>
<p><strong>उत्तर:</strong></p>
<p><strong>शक्तियां:</strong> [strengths]</p>
<p><strong>सुधार की आवश्यकता:</strong> [areas to improve]</p>
<br>

<h2>💰 प्रश्न 7: पैसे के मामले में कैसा रहेगा?</h2>
<p><strong>उत्तर:</strong> आर्थिक स्थिति [financial guidance without guarantees]...</p>
<br>

<h2>🙏 प्रश्न 8: मुझे कौन से उपाय करने चाहिए?</h2>
<p><strong>उत्तर:</strong> व्यावहारिक सुझाव:</p>
<ul>
<li>दैनिक आध्यात्मिक अभ्यास</li>
<li>व्यवहारिक सुधार</li>
<li>सकारात्मक आदतें</li>
</ul>
<br>

<h2>⚠️ महत्वपूर्ण अस्वीकरण</h2>
<p>यह केवल ज्योतिषीय मार्गदर्शन है, 100% सटीकता की गारंटी नहीं। महत्वपूर्ण निर्णयों के लिए योग्य सलाहकार से मिलें।</p>`;

      // Try gpt-4o first as fallback since gpt-5 might have issues
      console.log("Making OpenAI request with prompt length:", userPrompt.length);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const resultHtml = response.choices[0].message.content;

      // Check if we got a valid response
      if (!resultHtml || resultHtml.trim() === '') {
        console.error("Empty response from OpenAI");
        return res.status(500).json({ 
          ok: false, 
          error: "AI सेवा से खाली उत्तर मिला। कृपया पुनः प्रयास करें।" 
        });
      }

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
