# Production Deployment Guide

This guide covers deploying S.N.O.S. AI for production testing.

## Prerequisites

- Convex account (sign up at https://convex.dev)
- Vercel account (for Next.js deployment) or your preferred hosting provider
- All API keys ready (Azure Foundry AI, Reality Defender, VirusTotal, Firecrawl, Resend)
- Domain name (optional, but recommended)

## Deployment Steps

### Step 1: Deploy Convex Backend

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Login to Convex (if not already):**
   ```bash
   npx convex login
   ```

3. **Create a production deployment:**
   ```bash
   npx convex deploy --prod
   ```
   
   This will create a production deployment. Note the deployment URL (e.g., `https://your-project.convex.cloud`).

4. **Set production environment variables:**
   ```bash
   # Azure Foundry AI
   npx convex env set AZURE_FOUNDRY_BASE_URL "https://your-endpoint.services.ai.azure.com" --prod
   npx convex env set AZURE_FOUNDRY_API_KEY "your-production-api-key" --prod
   npx convex env set ANTHROPIC_VERSION "2023-06-01" --prod
   npx convex env set ANTHROPIC_MODEL "claude-3-5-sonnet-20241022" --prod

   # External APIs
   npx convex env set REALITY_DEFENDER_API_KEY "your-production-key" --prod
   npx convex env set VIRUSTOTAL_API_KEY "your-production-key" --prod
   npx convex env set FIRECRAWL_API_KEY "your-production-key" --prod

   # Authentication
   npx convex env set AUTH_RESEND_KEY "your-production-resend-key" --prod
   npx convex env set SITE_URL "https://your-domain.com" --prod
   ```

5. **Verify environment variables:**
   ```bash
   npx convex env list --prod
   ```

### Step 2: Configure Frontend for Production

1. **Get your Convex production URL:**
   - After deploying, Convex will provide a URL like: `https://your-project.convex.cloud`
   - Or check in Convex Dashboard → Settings → Deployment URL

2. **Update frontend Convex configuration:**
   - The frontend should already be configured to use environment variables
   - Check `frontend/.env.local` or create it if it doesn't exist

3. **Create/Update `frontend/.env.local`:**
   ```bash
   cd frontend
   ```
   
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
   ```

   **Note:** For Vercel deployment, you'll set this as an environment variable in the Vercel dashboard instead.

### Step 3: Deploy Frontend to Vercel

#### Option A: Deploy via Vercel CLI

1. **Install Vercel CLI (if not installed):**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

5. **Set environment variables in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_CONVEX_URL` = `https://your-project.convex.cloud`
   - Redeploy after adding environment variables

#### Option B: Deploy via Vercel Dashboard (Git Integration)

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Import project in Vercel:**
   - Go to https://vercel.com/dashboard
   - Click "Add New" → "Project"
   - Import your repository
   - Set Root Directory to `frontend`

3. **Configure build settings:**
   - Framework Preset: Next.js
   - Build Command: `npm run build` (or `yarn build`)
   - Output Directory: `.next`

4. **Set environment variables:**
   - In project settings → Environment Variables
   - Add: `NEXT_PUBLIC_CONVEX_URL` = `https://your-project.convex.cloud`
   - Make sure to select "Production" environment

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

### Step 4: Update Convex SITE_URL

After deploying the frontend, update the Convex `SITE_URL` environment variable:

```bash
cd backend
npx convex env set SITE_URL "https://your-vercel-app.vercel.app" --prod
```

Or if you have a custom domain:
```bash
npx convex env set SITE_URL "https://your-domain.com" --prod
```

### Step 5: Verify Deployment

1. **Test the deployed frontend:**
   - Visit your Vercel deployment URL
   - Try signing up/logging in
   - Test the chat functionality

2. **Check Convex Dashboard:**
   - Go to https://dashboard.convex.dev
   - Check logs for any errors
   - Verify functions are deployed correctly

3. **Test AI Agent:**
   - Send a test message in the chat
   - Verify AI responses are working
   - Check that file uploads work

## Environment Variables Summary

### Convex Backend (Production)
- `AZURE_FOUNDRY_BASE_URL`
- `AZURE_FOUNDRY_API_KEY`
- `ANTHROPIC_VERSION`
- `ANTHROPIC_MODEL`
- `REALITY_DEFENDER_API_KEY`
- `VIRUSTOTAL_API_KEY`
- `FIRECRAWL_API_KEY`
- `AUTH_RESEND_KEY`
- `SITE_URL` (your frontend URL)

### Next.js Frontend (Production)
- `NEXT_PUBLIC_CONVEX_URL` (your Convex production URL)

## Troubleshooting

### Frontend can't connect to Convex
- Verify `NEXT_PUBLIC_CONVEX_URL` is set correctly in Vercel
- Check that the Convex deployment is active
- Ensure the URL doesn't have trailing slashes

### Authentication not working
- Verify `SITE_URL` in Convex matches your frontend URL exactly
- Check Resend API key is valid
- Check Convex Auth logs in dashboard

### AI Agent not responding
- Verify all API keys are set in Convex production environment
- Check Convex function logs for errors
- Verify Azure Foundry AI endpoint URL is correct

### Build errors
- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility (Next.js 16 requires Node 18+)
- Review build logs in Vercel dashboard

## Production Checklist

- [ ] Convex backend deployed to production
- [ ] All environment variables set in Convex production
- [ ] Frontend deployed to Vercel (or your hosting provider)
- [ ] `NEXT_PUBLIC_CONVEX_URL` set in frontend environment
- [ ] `SITE_URL` updated in Convex to match frontend URL
- [ ] Authentication flow tested
- [ ] AI agent responses working
- [ ] File uploads working
- [ ] Error monitoring set up (optional)
- [ ] Custom domain configured (optional)

## Additional Resources

- [Convex Deployment Docs](https://docs.convex.dev/deployment)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

