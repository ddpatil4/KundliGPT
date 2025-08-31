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

      const systemPrompt = "आप एक हिंदी कुंडली सलाहकार हैं। व्यावहारिक जीवन सुझाव दें। कोई गारंटी या दावे न करें।";

      const userPrompt = `${formData.name} की कुंडली विश्लेषण करें:

जन्म विवरण:
- नाम: ${formData.name}
- तारीख: ${formData.birthDate}  
- समय: ${formData.birthTime}
- स्थान: ${formData.birthPlace || 'दिया गया स्थान'}

कृपया हिंदी में निम्न sections में जवाब दें:

<h2>💫 व्यक्तित्व सार</h2>
<p>संक्षिप्त व्यक्तित्व विश्लेषण</p>

<h2>💍 विवाह संभावनाएं</h2>
<p>संभावित समय और सुझाव (कोई गारंटी नहीं)</p>

<h2>🎯 करियर दिशा</h2>
<ul>
<li>उपयुक्त क्षेत्र 1</li>
<li>उपयुक्त क्षेत्र 2</li>
<li>उपयुक्त क्षेत्र 3</li>
</ul>

<h2>📚 सुझाव और उपाय</h2>
<p>व्यावहारिक जीवन सुझाव</p>

<h2>⚠️ महत्वपूर्ण नोट</h2>
<p>यह केवल मार्गदर्शन है, कोई गारंटी नहीं।</p>`;

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
