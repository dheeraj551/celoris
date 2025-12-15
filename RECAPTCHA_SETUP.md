# Google reCAPTCHA v3 Setup Guide

## Overview
Google reCAPTCHA v3 has been integrated into your contact form to prevent bot submissions. This is an invisible CAPTCHA that works in the background without interrupting the user experience.

## What's Been Implemented

### 1. **Frontend Components**
- ✅ Created `components/ReCaptchaProvider.tsx` - Provides reCAPTCHA context to the entire app
- ✅ Updated `app/layout.tsx` - Wrapped app with ReCaptchaProvider
- ✅ Updated `app/contact/page.tsx` - Integrated reCAPTCHA token generation on form submission

### 2. **Backend Verification**
- ✅ Updated `app/api/contact/route.ts` - Added server-side reCAPTCHA verification
- ✅ Score-based filtering: Submissions with scores below 0.5 are rejected as potential bots

### 3. **Configuration**
- ✅ Updated `.env.example` with required environment variables

## Setup Instructions

### Step 1: Get Your reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click on the **"+"** button to create a new site
3. Fill in the registration form:
   - **Label**: `Celoris Contact Form` (or any name you prefer)
   - **reCAPTCHA type**: Select **reCAPTCHA v3**
   - **Domains**: Add your domains:
     - `celorisdesigns.com`
     - `www.celorisdesigns.com`
     - `localhost` (for local testing)
   - Accept the reCAPTCHA Terms of Service
4. Click **Submit**
5. You'll receive two keys:
   - **Site Key** (starts with `6L...`) - This is public and used in the frontend
   - **Secret Key** (starts with `6L...`) - This is private and used in the backend

### Step 2: Add Keys to Your Environment Variables

1. Open your `.env.local` file (or `.env` file)
2. Add the following lines with your actual keys:

```bash
# Google reCAPTCHA v3 Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RECAPTCHA_SECRET_KEY=6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. **Important**: 
   - The `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` must start with `NEXT_PUBLIC_` to be accessible in the browser
   - The `RECAPTCHA_SECRET_KEY` should NOT have the `NEXT_PUBLIC_` prefix (it's server-side only)

### Step 3: Add Environment Variables to Vercel (Production)

If you're deploying to Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add both variables:
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` = Your site key
   - `RECAPTCHA_SECRET_KEY` = Your secret key
4. Make sure to add them for all environments (Production, Preview, Development)
5. Redeploy your application

### Step 4: Test the Implementation

1. **Local Testing**:
   ```bash
   npm run dev
   ```
   - Navigate to `/contact`
   - Fill out the form and submit
   - Check the browser console for any errors
   - The form should submit successfully if reCAPTCHA is working

2. **Verify reCAPTCHA is Loading**:
   - Open browser DevTools (F12)
   - Go to the Network tab
   - Look for requests to `google.com/recaptcha`
   - You should see a small reCAPTCHA badge in the bottom-right corner of the page

3. **Check Backend Verification**:
   - Submit a form
   - Check your server logs (Vercel logs or local terminal)
   - You should see the reCAPTCHA score (0.0 to 1.0)
   - Scores above 0.5 are considered human

## How It Works

### User Flow:
1. User fills out the contact form
2. When they click "Send Message", the form:
   - Validates all fields
   - Generates a reCAPTCHA token invisibly in the background
   - Sends the token along with form data to the API

### Backend Flow:
1. API receives the form data + reCAPTCHA token
2. Verifies the token with Google's servers
3. Google returns a score (0.0 to 1.0):
   - **1.0** = Very likely human
   - **0.5** = Neutral
   - **0.0** = Very likely bot
4. If score < 0.5, the submission is rejected
5. If score ≥ 0.5, the email is sent

## Adjusting the Bot Detection Threshold

The current threshold is set to **0.5**. You can adjust this in `app/api/contact/route.ts`:

```typescript
// Line ~48 in route.ts
if (!recaptchaData.success || recaptchaData.score < 0.5) {
    // Change 0.5 to your preferred threshold
    // Higher = stricter (may block some humans)
    // Lower = more lenient (may allow some bots)
}
```

**Recommended thresholds**:
- **0.3** - Very lenient (allows most submissions)
- **0.5** - Balanced (recommended)
- **0.7** - Strict (may block some legitimate users)

## Monitoring reCAPTCHA Performance

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Select your site
3. View analytics:
   - Total requests
   - Score distribution
   - Suspicious activity

## Troubleshooting

### Issue: "reCAPTCHA verification failed"
- **Cause**: Keys not configured or incorrect
- **Solution**: Double-check your environment variables

### Issue: reCAPTCHA badge not showing
- **Cause**: Site key not loaded or incorrect domain
- **Solution**: 
  - Check browser console for errors
  - Verify the site key is correct
  - Ensure your domain is added in reCAPTCHA admin

### Issue: All submissions are being blocked
- **Cause**: Threshold too high or secret key incorrect
- **Solution**: 
  - Lower the threshold (try 0.3)
  - Verify the secret key is correct

### Issue: Bots still getting through
- **Cause**: Threshold too low
- **Solution**: Increase the threshold to 0.6 or 0.7

## Additional Security Measures

While reCAPTCHA v3 is excellent, consider these additional measures:

1. **Rate Limiting**: Limit submissions per IP address
2. **Honeypot Fields**: Add hidden fields that bots might fill
3. **Email Verification**: Require email confirmation
4. **Time-based Checks**: Reject submissions that are too fast

## Support

If you encounter any issues:
1. Check the browser console for frontend errors
2. Check server logs for backend errors
3. Verify all environment variables are set correctly
4. Test with different reCAPTCHA score thresholds

---

**Implementation Date**: December 15, 2024
**reCAPTCHA Version**: v3
**Status**: ✅ Ready for deployment (pending environment variable configuration)
