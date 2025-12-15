# 🔧 reCAPTCHA Troubleshooting Guide

## Common Issues and Solutions

### 1. ❌ "reCAPTCHA verification failed. Please try again."

**Possible Causes:**
- reCAPTCHA token not being generated
- Environment variables not set
- Incorrect site key

**Solutions:**
1. Check browser console for errors
2. Verify `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set in `.env.local`
3. Ensure the site key starts with `6L`
4. Check that the domain is registered in reCAPTCHA admin

**How to Check:**
```javascript
// Open browser console and type:
console.log(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY)
// Should show your site key, not undefined
```

---

### 2. ❌ "Server configuration error"

**Cause:**
- `RECAPTCHA_SECRET_KEY` not set on server

**Solutions:**
1. Add `RECAPTCHA_SECRET_KEY` to `.env.local` (local)
2. Add to Vercel environment variables (production)
3. Restart your development server
4. Redeploy on Vercel

**Verification:**
- Check server logs for: "RECAPTCHA_SECRET_KEY is not configured"

---

### 3. ❌ reCAPTCHA badge not showing

**Possible Causes:**
- Script not loading
- Site key incorrect
- Domain not whitelisted

**Solutions:**
1. Check Network tab in DevTools
2. Look for requests to `google.com/recaptcha`
3. Verify domain is added in reCAPTCHA admin console
4. Clear browser cache

**Expected Behavior:**
- Small reCAPTCHA badge in bottom-right corner
- Badge says "protected by reCAPTCHA"

---

### 4. ❌ "You might be a bot" error for real users

**Cause:**
- Score threshold too high
- User behavior flagged as suspicious

**Solutions:**
1. Lower the threshold in `app/api/contact/route.ts`:
```typescript
// Change from 0.5 to 0.3
if (!recaptchaData.success || recaptchaData.score < 0.3) {
```

2. Check reCAPTCHA admin console for score distribution
3. Consider adding manual review for scores 0.3-0.5

**Score Guidelines:**
- **0.9-1.0**: Very likely human
- **0.7-0.9**: Likely human
- **0.5-0.7**: Neutral
- **0.3-0.5**: Suspicious
- **0.0-0.3**: Very likely bot

---

### 5. ❌ Bots still getting through

**Cause:**
- Threshold too low
- Sophisticated bots

**Solutions:**
1. Increase threshold to 0.6 or 0.7
2. Add additional validation:
   - Check for common spam keywords
   - Validate email domain
   - Add honeypot fields
   - Implement rate limiting

**Example Additional Validation:**
```typescript
// In app/api/contact/route.ts
const spamKeywords = ['viagra', 'casino', 'crypto'];
const hasSpam = spamKeywords.some(keyword => 
  message.toLowerCase().includes(keyword)
);

if (hasSpam) {
  return NextResponse.json(
    { error: 'Spam detected' },
    { status: 400 }
  );
}
```

---

### 6. ❌ "Security verification is loading..."

**Cause:**
- reCAPTCHA script still loading
- Slow network connection
- Script blocked by ad blocker

**Solutions:**
1. Wait a few seconds and try again
2. Disable ad blockers
3. Check browser console for script loading errors
4. Verify internet connection

**Prevention:**
- The form automatically disables until reCAPTCHA is ready
- This is normal on first page load

---

### 7. ❌ Form submits but no email received

**Cause:**
- Email configuration issue (not reCAPTCHA related)
- SMTP credentials incorrect

**Solutions:**
1. Check email environment variables:
   - `MAIL_HOST`
   - `MAIL_USERNAME`
   - `MAIL_PASSWORD`
2. Check server logs for email sending errors
3. Verify SMTP settings with your email provider

**Test Email Separately:**
- Try sending a test email without reCAPTCHA
- If it fails, the issue is with email config, not reCAPTCHA

---

### 8. ❌ "Invalid domain for site key"

**Cause:**
- Domain not registered in reCAPTCHA admin
- Using wrong site key

**Solutions:**
1. Go to https://www.google.com/recaptcha/admin
2. Click on your site
3. Add the domain under "Domains":
   - `localhost` (for local testing)
   - `celorisdesigns.com`
   - `www.celorisdesigns.com`
4. Save changes

---

### 9. ❌ TypeScript errors after implementation

**Possible Errors:**
```
Property 'grecaptcha' does not exist on type 'Window'
```

**Solution:**
- This is expected and handled with `(window as any).grecaptcha`
- The code is correct and will work at runtime

**If you want to fix TypeScript warnings:**
Create `types/grecaptcha.d.ts`:
```typescript
interface Window {
  grecaptcha: {
    ready: (callback: () => void) => void;
    execute: (siteKey: string, options: { action: string }) => Promise<string>;
  };
}
```

---

### 10. ❌ reCAPTCHA works locally but not in production

**Cause:**
- Environment variables not set in production
- Domain not whitelisted

**Solutions:**
1. **Vercel:**
   - Go to Settings → Environment Variables
   - Add both keys
   - Redeploy

2. **Other Platforms:**
   - Add environment variables to your hosting platform
   - Ensure they're available at build time and runtime

3. **Domain Check:**
   - Add production domain to reCAPTCHA admin
   - Remove `localhost` from production site key if needed

---

## Debugging Checklist

### Frontend Debugging:
```javascript
// In browser console:

// 1. Check if reCAPTCHA loaded
console.log(window.grecaptcha)

// 2. Check site key
console.log(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY)

// 3. Check for errors
// Look in Console tab for red errors
```

### Backend Debugging:
```typescript
// In app/api/contact/route.ts, add logging:

console.log('reCAPTCHA Data:', recaptchaData);
console.log('Score:', recaptchaData.score);
console.log('Success:', recaptchaData.success);
```

### Network Debugging:
1. Open DevTools (F12)
2. Go to Network tab
3. Submit form
4. Look for:
   - Request to `/api/contact`
   - Request to `google.com/recaptcha/api/siteverify`
5. Check response status and data

---

## Testing Guide

### Test 1: Basic Functionality
1. Go to `/contact`
2. Fill form with valid data
3. Submit
4. Should succeed

### Test 2: Empty Form
1. Submit empty form
2. Should show validation errors
3. Should NOT call reCAPTCHA

### Test 3: reCAPTCHA Loading
1. Open DevTools → Network tab
2. Refresh page
3. Look for `recaptcha/api.js`
4. Should load successfully

### Test 4: Token Generation
1. Open DevTools → Console
2. Fill and submit form
3. Look for reCAPTCHA token in network request
4. Token should be a long string

### Test 5: Score Verification
1. Add logging to API route
2. Submit form
3. Check server logs for score
4. Score should be 0.0-1.0

---

## Getting Help

### Check These First:
1. ✅ Environment variables set correctly
2. ✅ Domain registered in reCAPTCHA admin
3. ✅ Site key and secret key match
4. ✅ Browser console for errors
5. ✅ Server logs for errors

### Useful Links:
- **reCAPTCHA Admin**: https://www.google.com/recaptcha/admin
- **reCAPTCHA Docs**: https://developers.google.com/recaptcha/docs/v3
- **Support**: https://support.google.com/recaptcha

### Contact Information:
If issues persist after trying all solutions:
1. Check the implementation files
2. Review `RECAPTCHA_SETUP.md`
3. Test with different score thresholds
4. Consider alternative bot protection methods

---

**Last Updated**: December 15, 2024
**Version**: reCAPTCHA v3
