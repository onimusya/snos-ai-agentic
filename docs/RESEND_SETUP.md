# Resend Email Provider Setup Guide

This guide will help you set up Resend as the email provider for Convex Auth (Magic Links, OTPs, and Password Reset).

## Prerequisites

- A Resend account (sign up at [resend.com](https://resend.com))
- Access to your Convex deployment

## Step 1: Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Your Resend API Key

1. Log in to your Resend dashboard
2. Navigate to **API Keys** in the sidebar
3. Click **Create API Key**
4. Give it a name (e.g., "S.N.O.S. AI Production")
5. Copy the API key (you'll only see it once!)

## Step 3: Add Domain (Optional but Recommended)

For production, you should verify your domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `snos-ai.com`)
4. Follow the DNS verification steps:
   - Add the provided TXT record to your domain's DNS
   - Add the provided SPF record
   - Add the provided DKIM records
5. Wait for verification (usually takes a few minutes)

**Note:** Without domain verification, you can only send emails to the email address you signed up with, and emails may be marked as spam.

## Step 4: Set Environment Variable in Convex

Run this command from your backend directory:

```bash
cd backend
npx convex env set AUTH_RESEND_KEY your_resend_api_key_here
```

Replace `your_resend_api_key_here` with the API key you copied in Step 2.

## Step 5: Verify SITE_URL

Make sure your `SITE_URL` environment variable is set correctly:

```bash
npx convex env get SITE_URL
```

If it's not set or incorrect, set it:

```bash
npx convex env set SITE_URL https://your-domain.com
```

For local development:
```bash
npx convex env set SITE_URL http://localhost:3000
```

## Step 6: Test the Setup

1. Start your Convex backend:
   ```bash
   cd backend
   npx convex dev
   ```

2. Start your frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navigate to `/auth/login` or `/auth/register`
4. Try signing in with:
   - **Magic Link**: Enter your email and click "Send Magic Link"
   - **OTP**: Enter your email, then enter the 6-digit code sent to your email
   - **Password**: Create an account with email and password

## Troubleshooting

### Emails Not Sending

1. **Check API Key**: Verify the API key is correct:
   ```bash
   npx convex env get AUTH_RESEND_KEY
   ```

2. **Check Resend Dashboard**: Go to Resend dashboard → **Logs** to see if emails are being sent and any errors

3. **Check Domain Verification**: If using a custom domain, ensure it's verified in Resend

4. **Check SITE_URL**: Ensure `SITE_URL` matches your actual domain/URL

### Emails Going to Spam

1. **Verify Your Domain**: This is the most important step to avoid spam
2. **Check SPF/DKIM Records**: Ensure they're correctly configured
3. **Warm Up Your Domain**: Start with low email volumes and gradually increase

### Rate Limits

Resend free tier includes:
- 3,000 emails/month
- 100 emails/day

For higher limits, upgrade your Resend plan.

## Email Templates

The current implementation uses simple HTML email templates. You can customize them in:

- **Magic Link**: `backend/convex/auth.ts` → `ResendMagicLink` provider
- **OTP**: `backend/convex/auth.ts` → `ResendOTP` provider  
- **Password Reset**: `backend/convex/auth.ts` → `ResendOTPPasswordReset` provider

### Customizing Email Templates

You can customize the email HTML in the `sendVerificationRequest` function. For example:

```typescript
html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1>Welcome to S.N.O.S. AI</h1>
    <p>Your verification code is:</p>
    <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold;">
      ${token}
    </div>
    <p>This code expires in 15 minutes.</p>
  </div>
`,
```

## Production Checklist

- [ ] Domain verified in Resend
- [ ] SPF record added
- [ ] DKIM records added
- [ ] API key set in Convex environment variables
- [ ] SITE_URL set to production domain
- [ ] Email templates customized with your branding
- [ ] Tested all three auth methods (Magic Link, OTP, Password)
- [ ] Tested password reset flow

## Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Convex Auth Documentation](https://labs.convex.dev/auth)
- [Auth.js Email Providers](https://authjs.dev/getting-started/providers/resend)

