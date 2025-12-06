# Fix: Missing SITE_URL Error

## Immediate Fix

If you're seeing the error:
```
Uncaught Error: Missing environment variable `SITE_URL`
```

**Set the `SITE_URL` environment variable in your Convex production deployment:**

```bash
cd backend
npx convex env set SITE_URL "https://your-frontend-url.com" --prod
```

Replace `https://your-frontend-url.com` with:
- Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
- Or your custom domain (e.g., `https://yourdomain.com`)

## Verify It's Set

```bash
npx convex env get SITE_URL --prod
```

## Important Notes

1. **No trailing slash**: The URL should NOT end with `/`
   - ✅ Correct: `https://your-app.vercel.app`
   - ❌ Wrong: `https://your-app.vercel.app/`

2. **Must match your frontend URL exactly**: This is where Convex Auth will redirect users after magic link/OTP verification

3. **Required for authentication**: Without this, all authentication flows (magic link, OTP, password reset) will fail

## After Setting

1. The error should disappear immediately
2. Try authentication again (sign up/login)
3. Magic links and OTP emails should work correctly

## If You Haven't Deployed Frontend Yet

If you're testing before deploying the frontend, you can set a temporary URL:

```bash
npx convex env set SITE_URL "http://localhost:3000" --prod
```

But remember to update it to your production URL after deploying!

