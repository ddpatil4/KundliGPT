// ===============================================
// हिंदी कुंडली साइट - Configuration Example
// ===============================================
// इस file को "config.js" के नाम से copy करें और details भरें

module.exports = {
  // Database Configuration
  database: {
    host: "localhost",        // Database server address
    port: 5432,              // Database port (usually 5432 for PostgreSQL)
    database: "kundli_site", // Database name
    username: "your_username", // Database username
    password: "your_password", // Database password
    
    // Complete connection URL (optional - use this OR above details)
    url: "postgresql://username:password@localhost:5432/kundli_site"
  },

  // Security Settings
  security: {
    sessionSecret: "change-this-to-random-long-string", // Session encryption key
  },

  // Server Settings
  server: {
    port: 5000,              // Server port
    environment: "production" // "development" or "production"
  },

  // Site Settings (will be configurable from admin panel after setup)
  site: {
    name: "Hindi Kundli Insight",
    description: "Get personalized Hindi astrological guidance and kundli insights",
    keywords: "kundli, astrology, hindi, horoscope, jyotish, राशिफल"
  },

  // API Keys (optional - can be set from setup wizard)
  apis: {
    openai: "" // Leave empty to set from setup wizard
  }
};

// ===============================================
// Setup Instructions:
// ===============================================
// 1. Copy this file as "config.js"
// 2. Fill database details above
// 3. Change sessionSecret to random string
// 4. Run: npm install && npm run db:push
// 5. Start server: npm start
// 6. Visit site and complete setup wizard
// ===============================================