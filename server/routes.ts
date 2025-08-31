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

      const systemPrompt = "तुम एक जिम्मेदार हिंदी असिस्टेंट हो जो कुंडली-शैली की व्यावहारिक और सम्मानपूर्ण सलाह देता/देती है। कोई स्वास्थ्य/चिकित्सा/कानूनी/आर्थिक दावे या गारंटी नहीं देता/देती। शादी/संतान/करियर से जुड़ी बातों को 'संभावना', 'झुकाव', 'समय-विंडो' जैसे शब्दों में, और व्यक्ति की मेहनत/परिस्थितियों पर निर्भर मानकर लिखो। भाषा सरल हिंदी, हेडिंग्स साफ़, बुलेट्स छोटे, और टोन सकारात्मक पर यथार्थवादी हो।";

      const userPrompt = `उपयोगकर्ता इनपुट:
- नाम: ${formData.name}
- जन्म तिथि: ${formData.birthDate}
- जन्म समय: ${formData.birthTime}
- समय क्षेत्र (UTC offset): ${formData.timezone}
- स्थान: ${formData.birthPlace || (formData.latitude && formData.longitude ? `Lat ${formData.latitude}, Lon ${formData.longitude}` : 'निर्दिष्ट नहीं')}

Context Note: यह एक सामान्यीकृत विश्लेषण है; सटीक खगोलीय गणना/इफ़ेमेरिस शामिल नहीं है।

कृपया नीचे दिये सेक्शन्स में हिंदी में संरचित परिणाम दें:
1) समग्र सार (2 छोटे पैराग्राफ)
2) शादी के संभावित अवसर – वर्ष-रेंज विंडो (जैसे 2026–2028), निश्चित दावा नहीं
3) संतान के संभावित अवसर – वर्ष-रेंज/चरण, जिम्मेदार भाषा
4) करियर उपयुक्तता – 3–5 दिशाएँ + 1-लाइन क्यों
5) जल्दी सफलता किस फ़ील्ड में – 3 बुलेट + कारण
6) कौशल/पढ़ाई सुझाव – सीखने के विषय, शुरुआती रोडमैप
7) सामान्य सुझाव/उपाय – नैतिक/व्यावहारिक आदतें (धार्मिक/चिकित्सकीय दावे नहीं)
8) महत्वपूर्ण अस्वीकरण – मार्गदर्शन मात्र, गारंटी नहीं
Format: साफ HTML (<h2>, <ul><li>, <p>) बिना inline styles के।`;

      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_completion_tokens: 2000,
      });

      const resultHtml = response.choices[0].message.content;

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
