# 🛡️ reCAPTCHA Quick Setup

## ⚡ Quick Start (3 Steps)

### 1️⃣ Get Your Keys
Visit: https://www.google.com/recaptcha/admin
- Create new site
- Choose **reCAPTCHA v3**
- Add domains: `celorisdesigns.com`, `localhost`
- Copy both keys

### 2️⃣ Add to Environment Variables
Add to your `.env.local` file:
```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

### 3️⃣ Deploy
- Add same variables to Vercel environment variables
- Redeploy your app
- Test the contact form

## ✅ What's Protected
- ✅ Contact form at `/contact`
- ✅ Bot submissions blocked automatically
- ✅ Score-based filtering (threshold: 0.5)
- ✅ Invisible to users (no clicking required)

## 🔍 Testing
1. Go to `/contact`
2. Fill and submit the form
3. Look for reCAPTCHA badge (bottom-right corner)
4. Check server logs for score

## 📊 Monitoring
View stats at: https://www.google.com/recaptcha/admin

---
For detailed setup instructions, see `RECAPTCHA_SETUP.md`
