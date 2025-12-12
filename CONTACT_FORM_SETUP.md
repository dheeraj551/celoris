# Contact Form Email Configuration

This document explains how to set up the email functionality for the contact form.

## Prerequisites

1. Install the required npm packages:
   ```bash
   npm install nodemailer
   npm install --save-dev @types/nodemailer
   ```

## Environment Variables Setup

Create a `.env.local` file in the root directory of the project and add the following environment variables:

```env
# Email Configuration for Contact Form
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=support@celorisdesigns.com
MAIL_PASSWORD=qyrecjzeqfwkyavr
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=support@celorisdesigns.com
MAIL_FROM_NAME=Celoris
```

## How It Works

### 1. Contact Form (`app/contact/page.tsx`)
- Users fill out a form with their name, email, subject, and message
- Form includes client-side validation
- Shows loading state while submitting
- Displays success/error messages using toast notifications

### 2. API Route (`app/api/contact/route.ts`)
- Receives form data via POST request
- Validates all required fields
- Sends two emails:
  - **Notification email** to `support@celorisdesigns.com` with the user's message
  - **Confirmation email** to the user acknowledging receipt of their message

### 3. Email Templates
Both emails use HTML templates with:
- Professional styling
- Celoris branding (green color scheme)
- Responsive design
- Plain text fallback

## Testing the Contact Form

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/contact` page

3. Fill out the form with:
   - Your name
   - Your email address
   - A subject line
   - A message (minimum 10 characters)

4. Click "Send Message"

5. You should see:
   - A loading spinner while sending
   - A success toast notification
   - The form will reset after successful submission

6. Check the email inbox:
   - `support@celorisdesigns.com` should receive the notification
   - The sender's email should receive a confirmation

## Troubleshooting

### Email not sending
- Verify that all environment variables are correctly set in `.env.local`
- Check that the Gmail app password is valid
- Ensure the development server was restarted after adding environment variables

### TypeScript errors
- Make sure `nodemailer` and `@types/nodemailer` are installed
- Run `npm install` to ensure all dependencies are installed

### Toast notifications not showing
- The Toaster component has been added to the root layout
- Check browser console for any errors

## Security Notes

- Never commit `.env.local` to version control
- The Gmail app password is already configured for `support@celorisdesigns.com`
- For production, consider using a dedicated email service like SendGrid or AWS SES

## Features

✅ Client-side form validation
✅ Server-side validation
✅ Professional HTML email templates
✅ Automatic confirmation emails to users
✅ Loading states and error handling
✅ Toast notifications for user feedback
✅ Reply-to functionality (support can reply directly to user emails)
✅ Responsive design
