import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import Resend from "@auth/core/providers/resend";
import { Email } from "@convex-dev/auth/providers/Email";
import { Resend as ResendAPI } from "resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";

// Magic Link Provider (Resend)
const ResendMagicLink = Resend({
  id: "resend",
  apiKey: process.env.AUTH_RESEND_KEY,
  async sendVerificationRequest({ identifier: email, provider, url }) {
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: "S.N.O.S. AI <noreply@connesis.com>",
      to: [email],
      subject: `Sign in to S.N.O.S. AI`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Sign in to S.N.O.S. AI</h2>
          <p>Click the link below to sign in:</p>
          <div style="margin: 20px 0;">
            <a href="${url}" style="background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Sign In
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${url}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't request this link, you can safely ignore this email.</p>
        </div>
      `,
      text: `Sign in to S.N.O.S. AI by clicking this link: ${url}\n\nThis link will expire in 24 hours.`,
    });

    if (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});

// OTP Provider (Resend with OTP)
const ResendOTP = Email({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY,
  maxAge: 60 * 15, // 15 minutes
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes) {
        crypto.getRandomValues(bytes);
      },
    };
    const alphabet = "0123456789";
    const length = 6;
    return generateRandomString(random, alphabet, length);
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: "S.N.O.S. AI <noreply@connesis.com>",
      to: [email],
      subject: `Sign in to S.N.O.S. AI`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your verification code</h2>
          <p>Use this code to sign in to S.N.O.S. AI:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            ${token}
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `,
      text: `Your verification code is: ${token}. This code will expire in 15 minutes.`,
    });

    if (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});

// Password Reset Provider (OTP-based)
const ResendOTPPasswordReset = Email({
  id: "resend-otp-reset",
  apiKey: process.env.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes) {
        crypto.getRandomValues(bytes);
      },
    };
    const alphabet = "0123456789";
    const length = 6;
    return generateRandomString(random, alphabet, length);
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: "S.N.O.S. AI <noreply@connesis.com>",
      to: [email],
      subject: `Reset your password in S.N.O.S. AI`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Code</h2>
          <p>Use this code to reset your password:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            ${token}
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
      `,
      text: `Your password reset code is: ${token}. This code will expire in 15 minutes.`,
    });

    if (error) {
      throw new Error("Could not send password reset email");
    }
  },
});

// Initialize Convex Auth with all providers
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    ResendMagicLink, // Magic Link
    ResendOTP, // OTP
    Password({ reset: ResendOTPPasswordReset }), // Password with reset
  ],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      // After user is created/updated by Convex Auth, sync with our users table
      // The user is already created by Convex Auth, we just need to add our custom fields
      const user = await ctx.db.get(args.userId);
      if (!user) {
        return;
      }

      // Get email from the auth account
      const account = await ctx.db
        .query("authAccounts")
        .filter((q: any) => q.eq(q.field("userId"), args.userId))
        .first();

      if (account) {
        // Update user with our custom fields if they don't exist
        const updates: any = {};
        
        // Only set defaults if fields don't exist
        if (!user.role) {
          updates.role = "user";
        }
        if (!user.subscriptionPlan) {
          updates.subscriptionPlan = "free";
        }
        if (!user.subscriptionStatus) {
          updates.subscriptionStatus = "active";
        }
        if (user.usageCount === undefined) {
          updates.usageCount = 0;
        }
        if (!user.language) {
          updates.language = "en";
        }

        if (Object.keys(updates).length > 0) {
          await ctx.db.patch(args.userId, updates);
        }
      }
    },
  },
});

// Re-export getCurrentUser for backward compatibility
export { getCurrentUser } from "./authQueries";
