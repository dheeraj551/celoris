# ✅ reCAPTCHA Deployment Checklist

Use this checklist to ensure proper reCAPTCHA deployment.

---

## 📋 Pre-Deployment

### 1. Get reCAPTCHA Keys
- [ ] Visit https://www.google.com/recaptcha/admin
- [ ] Create new site
- [ ] Select **reCAPTCHA v3**
- [ ] Add domains:
  - [ ] `celorisdesigns.com`
  - [ ] `www.celorisdesigns.com`
  - [ ] `localhost` (for testing)
- [ ] Copy **Site Key** (starts with `6L`)
- [ ] Copy **Secret Key** (starts with `6L`)

### 2. Local Environment Setup
- [ ] Create/open `.env.local` file
- [ ] Add `NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key`
- [ ] Add `RECAPTCHA_SECRET_KEY=your_secret_key`
- [ ] Save file
- [ ] Restart development server

### 3. Local Testing
- [ ] Run `npm run dev`
- [ ] Navigate to `http://localhost:3000/contact`
- [ ] Check for reCAPTCHA badge (bottom-right)
- [ ] Open browser DevTools
- [ ] Check Console for errors
- [ ] Fill out contact form
- [ ] Submit form
- [ ] Verify submission succeeds
- [ ] Check email received
- [ ] Check server logs for reCAPTCHA score

---

## 🚀 Production Deployment

### 4. Vercel Configuration
- [ ] Go to Vercel Dashboard
- [ ] Select your project
- [ ] Go to Settings → Environment Variables
- [ ] Add `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
  - [ ] Value: Your site key
  - [ ] Environment: Production, Preview, Development
- [ ] Add `RECAPTCHA_SECRET_KEY`
  - [ ] Value: Your secret key
  - [ ] Environment: Production, Preview, Development
- [ ] Save changes

### 5. Deploy Application
- [ ] Commit all changes to Git
- [ ] Push to repository
- [ ] Wait for Vercel deployment
- [ ] Check deployment logs for errors
- [ ] Verify build succeeded

### 6. Production Testing
- [ ] Visit your live site
- [ ] Navigate to `/contact` page
- [ ] Verify reCAPTCHA badge appears
- [ ] Open browser DevTools
- [ ] Check Console for errors
- [ ] Fill out contact form with test data
- [ ] Submit form
- [ ] Verify success message
- [ ] Check email received
- [ ] Test from different devices/browsers

---

## 🔍 Verification

### 7. reCAPTCHA Admin Console
- [ ] Go to https://www.google.com/recaptcha/admin
- [ ] Select your site
- [ ] Check "Requests" graph
- [ ] Verify requests are being logged
- [ ] Check score distribution
- [ ] Review any errors/warnings

### 8. Functionality Tests
- [ ] **Test 1: Valid Submission**
  - [ ] Fill all fields correctly
  - [ ] Submit
  - [ ] Should succeed
  
- [ ] **Test 2: Empty Form**
  - [ ] Submit without filling
  - [ ] Should show validation errors
  
- [ ] **Test 3: Invalid Email**
  - [ ] Enter invalid email
  - [ ] Should show email error
  
- [ ] **Test 4: Short Message**
  - [ ] Enter message < 10 characters
  - [ ] Should show message error

### 9. Security Verification
- [ ] Check that reCAPTCHA token is required
- [ ] Verify backend validates token
- [ ] Test score threshold (try adjusting if needed)
- [ ] Monitor for bot submissions
- [ ] Review reCAPTCHA analytics

---

## 📊 Monitoring Setup

### 10. Set Up Monitoring
- [ ] Bookmark reCAPTCHA admin console
- [ ] Set up email notifications (optional)
- [ ] Monitor submission patterns
- [ ] Track bot detection rate
- [ ] Review weekly analytics

### 11. Performance Check
- [ ] Test page load speed
- [ ] Verify reCAPTCHA doesn't slow down form
- [ ] Check mobile performance
- [ ] Test on slow connections

---

## 📝 Documentation

### 12. Team Documentation
- [ ] Share `RECAPTCHA_QUICK_START.md` with team
- [ ] Document environment variables
- [ ] Add to deployment guide
- [ ] Update README if needed

### 13. Backup & Recovery
- [ ] Save reCAPTCHA keys securely
- [ ] Document where keys are stored
- [ ] Note recovery process
- [ ] Keep backup of configuration

---

## 🎯 Post-Deployment

### 14. First Week Monitoring
- [ ] Day 1: Check for any errors
- [ ] Day 3: Review submission patterns
- [ ] Day 7: Analyze bot detection rate
- [ ] Adjust threshold if needed

### 15. Optimization
- [ ] Review reCAPTCHA scores
- [ ] Adjust threshold based on data:
  - Too many false positives? → Lower threshold
  - Bots getting through? → Raise threshold
- [ ] Monitor user feedback
- [ ] Fine-tune as needed

---

## 🔧 Troubleshooting Reference

If issues occur, check:
- [ ] `RECAPTCHA_TROUBLESHOOTING.md`
- [ ] Browser console errors
- [ ] Server logs
- [ ] Environment variables
- [ ] reCAPTCHA admin console

---

## ✅ Final Verification

### All Systems Go?
- [ ] ✅ reCAPTCHA keys obtained
- [ ] ✅ Environment variables set (local)
- [ ] ✅ Environment variables set (production)
- [ ] ✅ Local testing passed
- [ ] ✅ Production deployment successful
- [ ] ✅ Production testing passed
- [ ] ✅ reCAPTCHA admin showing requests
- [ ] ✅ Email delivery working
- [ ] ✅ No console errors
- [ ] ✅ No server errors
- [ ] ✅ Team documented
- [ ] ✅ Monitoring set up

---

## 🎉 Success Criteria

Your reCAPTCHA implementation is successful when:
1. ✅ Contact form submissions work normally
2. ✅ reCAPTCHA badge visible on page
3. ✅ No bot submissions getting through
4. ✅ No legitimate users being blocked
5. ✅ reCAPTCHA admin showing activity
6. ✅ Email notifications working
7. ✅ No errors in console or logs

---

## 📞 Need Help?

If any checklist item fails:
1. Refer to `RECAPTCHA_TROUBLESHOOTING.md`
2. Check `RECAPTCHA_SETUP.md` for detailed instructions
3. Review implementation files
4. Test with different configurations

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete
**Notes**: 
_______________________________________________
_______________________________________________
_______________________________________________

---

**Last Updated**: December 15, 2024
**Version**: reCAPTCHA v3
