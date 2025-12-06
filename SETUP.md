# S.N.O.S. AI - Setup Guide

This guide will help you set up both the frontend and backend for the S.N.O.S. AI platform.

## Prerequisites

- Node.js 18+ installed
- npm or pnpm
- A Convex account (free tier available)

## Quick Start

### 1. Backend Setup (Convex)

```bash
cd backend
npm install
npx convex dev
```

This will:
- Initialize your Convex project (if first time)
- Create a deployment
- Generate TypeScript types
- Start watching for changes

**Important:** Copy the `CONVEX_DEPLOYMENT` URL from the output. You'll need it for the frontend.

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

Add your Convex URL:
```
NEXT_PUBLIC_CONVEX_URL=your-convex-deployment-url-from-step-1
```

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

### Backend (`backend/.env`)

Create this file and add:

```bash
# Convex (auto-generated when you run `npx convex dev`)
CONVEX_DEPLOYMENT=your-deployment-url

# Azure Foundry AI (Anthropic Claude)
AZURE_FOUNDRY_BASE_URL=https://your-endpoint.openai.azure.com
AZURE_FOUNDRY_API_KEY=your-api-key
ANTHROPIC_VERSION=2023-06-01
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# Reality Defender
REALITY_DEFENDER_API_KEY=your-api-key

# VirusTotal
VIRUSTOTAL_API_KEY=your-api-key

# Firecrawl
FIRECRAWL_API_KEY=your-api-key
```

### Frontend (`frontend/.env.local`)

```bash
NEXT_PUBLIC_CONVEX_URL=your-convex-deployment-url
```

## Project Structure

```
snos-ai-agentic/
├── backend/              # Convex backend
│   ├── convex/          # Convex functions
│   │   ├── schema.ts    # Database schema
│   │   ├── auth.ts      # Authentication
│   │   ├── users.ts     # User management
│   │   ├── conversations.ts
│   │   ├── messages.ts
│   │   ├── reports.ts
│   │   ├── agent.ts     # AI Agent
│   │   └── tools.ts     # AI Tools
│   └── package.json
├── frontend/            # Next.js frontend
│   ├── app/            # App Router pages
│   ├── components/      # React components
│   ├── hooks/          # Custom hooks
│   └── lib/            # Utilities
├── mockup/             # Reference design (React + Vite)
└── docs/               # Documentation
```

## Current Status

### ✅ Completed

- [x] Project documentation (PRD, Application Flow, UI Guidelines, Development Plan, TODO)
- [x] Backend database schema
- [x] Backend functions (auth, users, conversations, messages, reports)
- [x] Frontend Next.js setup
- [x] Frontend design system (matching mockup)
- [x] Convex client configuration
- [x] Landing page
- [x] Shadcn UI components

### 🚧 In Progress

- [ ] Convex Auth configuration
- [ ] AI Agent implementation
- [ ] External API integrations

### ⏳ Next Steps

1. **Complete Authentication:**
   - Configure Convex Auth
   - Create login/register pages
   - Add protected routes

2. **Build Chat Interface:**
   - Conversation list sidebar
   - Message display
   - Chat input with file upload
   - Risk report panel

3. **Implement AI Agent:**
   - Set up Anthropic Claude via Azure Foundry AI
   - Implement tool calling
   - Add system prompt

4. **External API Integrations:**
   - VirusTotal URL scanning
   - Reality Defender (image, video, audio)
   - Firecrawl web search

5. **Additional Pages:**
   - Pricing page
   - User profile
   - Admin console

## Development Workflow

### Backend Development

1. Make changes to files in `backend/convex/`
2. Convex automatically detects changes and pushes updates
3. Types are auto-generated in `backend/convex/_generated/`

### Frontend Development

1. Make changes to files in `frontend/`
2. Next.js hot-reloads automatically
3. For Convex types, copy from `backend/convex/_generated/api.d.ts` to `frontend/convex/_generated/api.d.ts` (or set up a symlink)

### Connecting Frontend to Backend

1. Run `npx convex dev` in the backend folder
2. Copy the deployment URL
3. Add it to `frontend/.env.local` as `NEXT_PUBLIC_CONVEX_URL`
4. Restart the frontend dev server

## Troubleshooting

### Frontend can't connect to Convex

- Check that `NEXT_PUBLIC_CONVEX_URL` is set in `.env.local`
- Make sure the backend is running (`npx convex dev`)
- Verify the URL is correct (should start with `https://`)

### TypeScript errors in frontend

- Run `npx convex codegen` in the backend folder
- Copy generated types to `frontend/convex/_generated/`
- Or set up a symlink between the two `_generated` folders

### Convex functions not found

- Make sure backend is running
- Check that functions are exported correctly
- Verify function names match between backend and frontend

## API Keys Setup

### Azure Foundry AI (Anthropic Claude)

1. Get access to Azure Foundry AI
2. Create an endpoint
3. Get API key from Azure portal
4. Add to `backend/.env`

### Reality Defender

1. Sign up at [Reality Defender](https://www.realitydefender.com/)
2. Get API key from dashboard
3. Add to `backend/.env`

### VirusTotal

1. Sign up at [VirusTotal](https://www.virustotal.com/)
2. Get API key from account settings
3. Add to `backend/.env`

### Firecrawl

1. Sign up at [Firecrawl](https://www.firecrawl.dev/)
2. Get API key from dashboard
3. Add to `backend/.env`

## Next Steps

See `docs/TODO_TASKS.md` for the complete task list and progress tracking.

## Support

For issues or questions:
1. Check the documentation in `docs/`
2. Review the code comments
3. Check Convex and Next.js documentation

