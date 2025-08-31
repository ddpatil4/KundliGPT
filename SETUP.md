# Hindi Kundli Insight - PHP Style Setup Guide

## 📁 PHP-Style Installation (Copy & Configure)

### 1️⃣ **Copy Files to Server**
```bash
# Upload all files to your server directory
# Example: /var/www/your-domain/
```

### 2️⃣ **Database Setup**
Create PostgreSQL database:
```sql
CREATE DATABASE kundli_site;
CREATE USER kundli_user WITH PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE kundli_site TO kundli_user;
```

### 3️⃣ **Configuration Setup**
```bash
# Copy config example file
cp config.example.js config.js

# Edit config.js with your details:
nano config.js
```

**Fill in your database details:**
```javascript
module.exports = {
  database: {
    host: "localhost",
    port: 5432,
    database: "kundli_site", 
    username: "kundli_user",
    password: "your_strong_password"
  },
  security: {
    sessionSecret: "your-random-secret-here-make-it-long-and-secure"
  }
};
```

### 4️⃣ **Install Dependencies**
```bash
npm install
```

### 5️⃣ **Setup Database Schema**
```bash
npm run db:push
```

### 6️⃣ **Start Application**
```bash
# Development
npm run dev

# Production
npm start
```

### 7️⃣ **Complete Web Setup**
1. Visit your site URL
2. Complete 4-step setup wizard:
   - ✅ Database details (auto-detected from config.js)
   - ✅ Site configuration
   - ✅ OpenAI API key
   - ✅ Admin user creation

## 🔧 **Alternative: Manual Config**

Create `config.js` with all details:

```javascript
module.exports = {
  database: {
    url: "postgresql://username:password@host:port/database"
  },
  security: {
    sessionSecret: "your-secret-key"
  },
  server: {
    port: 5000,
    environment: "production"
  },
  site: {
    name: "My Kundli Site",
    description: "Personalized astrology guidance",
    keywords: "kundli, astrology, hindi"
  },
  apis: {
    openai: "sk-your-openai-key" // Optional
  }
};
```

## 🚀 **Production Deployment**

### Environment Variables (Optional)
If you prefer environment variables:
```bash
DATABASE_URL="postgresql://user:pass@host:port/db"
SESSION_SECRET="your-secret"
NODE_ENV="production"
PORT="5000"
OPENAI_API_KEY="sk-..."
```

### PM2 Process Manager
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📋 **Requirements**
- Node.js 18+
- PostgreSQL 12+
- OpenAI API Key (get from platform.openai.com)

## 🎯 **Features After Setup**
- ✅ Complete kundli generation system
- ✅ WordPress-style blog management
- ✅ User registration & admin panel
- ✅ Multi-language support (Hindi/English/Marathi)
- ✅ SEO optimized
- ✅ Mobile responsive

## 📞 **Support**
After copying files and filling config.js, everything works automatically like PHP applications!