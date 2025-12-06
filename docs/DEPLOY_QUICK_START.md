# Quick Deployment Guide

## Prerequisites
- Convex account: https://convex.dev
- Vercel account: https://vercel.com
- All API keys ready

## Step-by-Step Commands

### 1. Deploy Convex Backend

```bash
cd backend

# Login to Convex
npx convex login

# Deploy to production
npx convex deploy --prod

# Note the deployment URL (e.g., https://your-project.convex.cloud)
```

### 2. Set Production Environment Variables

```bash
# Still in backend/ directory

# Azure Foundry AI
npx convex env set AZURE_FOUNDRY_BASE_URL "https://your-endpoint.services.ai.azure.com" --prod
npx convex env set AZURE_FOUNDRY_API_KEY "your-key" --prod
npx convex env set ANTHROPIC_VERSION "2023-06-01" --prod
npx convex env set ANTHROPIC_MODEL "claude-3-5-sonnet-20241022" --prod

# External APIs
npx convex env set REALITY_DEFENDER_API_KEY "your-key" --prod
npx convex env set VIRUSTOTAL_API_KEY "your-key" --prod
npx convex env set FIRECRAWL_API_KEY "your-key" --prod

# Authentication
npx convex env set AUTH_RESEND_KEY "your-key" --prod
# SITE_URL will be set after frontend deployment
```

### 3. Deploy Frontend to Vercel

#### Option A: Vercel CLI

```bash
cd frontend

# Install Vercel CLI (if not installed)
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Option B: Vercel Dashboard

1. Push code to GitHub/GitLab
2. Go to https://vercel.com/dashboard
3. Import repository
4. Set Root Directory: `frontend`
5. Add environment variable:
   - Name: `NEXT_PUBLIC_CONVEX_URL`
   - Value: `https://your-project.convex.cloud` (from step 1)
6. Deploy

### 4. Update SITE_URL in Convex

After frontend is deployed, get your Vercel URL and update:

```bash
cd backend
npx convex env set SITE_URL "https://your-app.vercel.app" --prod
```

## Verify Deployment

1. Visit your Vercel URL
2. Test sign up/login
3. Test chat functionality
4. Check Convex Dashboard for logs

## Troubleshooting

- **Frontend can't connect**: Check `NEXT_PUBLIC_CONVEX_URL` in Vercel
- **Auth not working**: Verify `SITE_URL` matches frontend URL exactly
- **AI not responding**: Check all API keys are set in Convex production

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

