# S.N.O.S. AI - Say No to Online Scam AI

**S.N.O.S. AI** is a conversational AI agent platform designed to protect users from digital fraud and online scams. It functions as an active "Digital Private Investigator," providing multi-modal forensic analysis and real-time threat intelligence powered by GenAI LLM.

## 🛡️ Overview

S.N.O.S. AI empowers everyday users to navigate the digital world safely through:
- **Multi-modal Analysis**: Text, images, audio, video, and URL analysis
- **Deepfake Detection**: AI-powered detection of manipulated media
- **Real-time Threat Intelligence**: Instant scanning of URLs and content
- **Community Reporting**: Crowdsourced threat intelligence
- **Multi-lingual Support**: English, Malay, and Chinese Simplified

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or pnpm
- A Convex account (free tier available at [convex.dev](https://convex.dev))

### Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd snos-ai-agentic
   ```

2. **Set up the backend**:
   ```bash
   cd backend
   npm install
   npx convex dev
   ```
   
   This will:
   - Initialize your Convex project
   - Create a deployment
   - Generate TypeScript types
   - Start watching for changes
   
   **Important**: Copy the `CONVEX_URL` from the output (e.g., `https://your-deployment.convex.cloud`)

3. **Set up the frontend**:
   ```bash
   cd ../frontend
   npm install
   ```
   
   Create `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Add your Convex URL:
   ```env
   NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
   ```

4. **Start development servers**:

   **Terminal 1 - Backend**:
   ```bash
   cd backend
   npx convex dev
   ```

   **Terminal 2 - Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
snos-ai-agentic/
├── backend/                 # Convex backend
│   ├── convex/             # Convex functions
│   │   ├── schema.ts       # Database schema
│   │   ├── auth.ts         # Authentication
│   │   ├── users.ts        # User management
│   │   ├── conversations.ts # Conversation management
│   │   ├── messages.ts     # Message handling
│   │   ├── reports.ts      # Community reporting
│   │   ├── agent.ts        # AI Agent implementation
│   │   └── tools.ts        # AI Agent tools
│   ├── package.json
│   └── README.md
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities
│   └── package.json
├── mockup/                # Reference design (React + Vite)
├── docs/                  # Documentation
│   ├── PRD.md            # Product Requirements Document
│   ├── APPLICATION_FLOW.md # Application flow documentation
│   ├── UI_DESIGN_GUIDELINES.md # Design system
│   ├── SYSTEM_PROMPT.md  # AI Agent system prompt
│   ├── DEVELOPMENT_PLAN.md # Technical development plan
│   └── TODO_TASKS.md     # Task tracking
├── SETUP.md              # Detailed setup guide
├── SYNC_TYPES.md         # Type syncing guide
└── README.md             # This file
```

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI
- Convex React Client

**Backend:**
- Convex (Database, File Storage, Authentication, Functions)
- Mastra Core Agent (AI Agent framework)
- Vercel AI SDK
- Anthropic Claude (via Azure Foundry AI)

**External Services:**
- Reality Defender (Deepfake detection)
- VirusTotal (Threat intelligence)
- Firecrawl (Web search)

### Database Schema

- **users**: User accounts with subscription plans
- **conversations**: Chat conversations
- **messages**: Messages in conversations
- **reports**: Community reports (phone, URL, email, content)
- **threats**: Verified threats database
- **news**: Scam news articles

## 🔧 Configuration

### Environment Variables

**Backend** (Set via `npx convex env set`):
```bash
# AI Agent
AZURE_FOUNDRY_BASE_URL=https://your-endpoint.services.ai.azure.com
AZURE_FOUNDRY_API_KEY=your-api-key
ANTHROPIC_VERSION=2023-06-01
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# External Tools
REALITY_DEFENDER_API_KEY=your-api-key
VIRUSTOTAL_API_KEY=your-api-key
FIRECRAWL_API_KEY=your-api-key

# Authentication (REQUIRED)
AUTH_RESEND_KEY=your-resend-api-key
SITE_URL=http://localhost:3000  # or https://your-domain.com for production
JWT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
JWKS={"keys":[{"kty":"RSA",...}]}
```

**Note:** Environment variables are set using `npx convex env set` in the backend directory. See `backend/ENV_SETUP.md` for detailed instructions.

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

See `SETUP.md` for detailed configuration instructions.

## 📚 Documentation

- **[PRD](./docs/PRD.md)**: Product Requirements Document
- **[Application Flow](./docs/APPLICATION_FLOW.md)**: User flows and system flows
- **[UI Design Guidelines](./docs/UI_DESIGN_GUIDELINES.md)**: Design system and component patterns
- **[System Prompt](./docs/SYSTEM_PROMPT.md)**: AI Agent system prompt
- **[Development Plan](./docs/DEVELOPMENT_PLAN.md)**: Technical specifications
- **[TODO Tasks](./docs/TODO_TASKS.md)**: Task tracking and progress
- **[Setup Guide](./SETUP.md)**: Detailed setup instructions
- **[Type Syncing](./SYNC_TYPES.md)**: Guide for syncing Convex types
- **[Deployment Guide](./docs/DEPLOYMENT.md)**: Production deployment instructions
- **[Environment Setup](./backend/ENV_SETUP.md)**: Environment variables configuration
- **[JWT Key Setup](./docs/FIX_JWT_PRIVATE_KEY.md)**: JWT_PRIVATE_KEY and JWKS setup guide

## 🎨 Design Philosophy

The design follows **"High-Utility Minimalism"** or **"Productivity Zen"**:

- **Minimal shadows**: Use borders to define hierarchy
- **Pill-shaped buttons**: `rounded-full` for all buttons
- **Rounded corners**: `rounded-md` (6px-8px) for cards and inputs
- **High contrast**: Black & white with accent colors (violet, cyan)
- **Content-first**: Rigorous alignment and spacing

See [UI Design Guidelines](./docs/UI_DESIGN_GUIDELINES.md) for complete design system.

## 🚦 Development Workflow

### Backend Development

1. Make changes to files in `backend/convex/`
2. Convex automatically detects changes and pushes updates
3. Types are auto-generated in `backend/convex/_generated/`
4. Sync types to frontend (see `SYNC_TYPES.md`)

### Frontend Development

1. Make changes to files in `frontend/`
2. Next.js hot-reloads automatically
3. For Convex types, sync from backend after schema changes

### Type Syncing

After running `npx convex dev` in the backend, sync types to frontend:

```bash
cp backend/convex/_generated/api.d.ts frontend/convex/_generated/api.d.ts
cp backend/convex/_generated/server.d.ts frontend/convex/_generated/server.d.ts
cp backend/convex/_generated/dataModel.d.ts frontend/convex/_generated/dataModel.d.ts
```

Or use the automated script in `SYNC_TYPES.md`.

## 🧪 Testing

### Running the Application

**Development:**
```bash
# Backend (Terminal 1)
cd backend
npx convex dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

**Production Build:**
```bash
# Backend
cd backend
npx convex deploy --prod

# Frontend
cd frontend
npm run build
npm start
```

**Production Deployment:**
See [Deployment Guide](./docs/DEPLOYMENT.md) for complete production deployment instructions, including:
- Convex backend deployment
- Vercel frontend deployment
- Environment variables setup
- Authentication configuration

## 📦 Features

### Core Features

- ✅ **Chat Interface**: Real-time conversation with AI agent
- ✅ **Multi-modal Analysis**: Text, images, audio, video, URLs
- ✅ **Vision Analysis**: Image context understanding, OCR, fraud detection
- ✅ **Deepfake Detection**: Image, video, and audio analysis (on-demand)
- ✅ **URL Scanning**: Phishing and malicious website detection
- ✅ **File Upload**: Support for images, videos, and audio files
- ✅ **Community Reporting**: User-reported threats
- ✅ **Admin Console**: Content moderation and user management
- ✅ **Multi-lingual**: English, Malay, Chinese Simplified
- ✅ **Authentication**: Magic Link, OTP, and Password login

### Subscription Plans

- **Free**: 5 scans/month, basic features
- **Pro**: Unlimited scans, advanced features
- **Enterprise**: Full API access, custom integrations

## 🔐 Authentication

The platform uses **Convex Auth** for authentication. Users can:
- Register with email and password
- Sign in with Magic Link (email link)
- Sign in with OTP (one-time password via email)
- Sign in with Password
- Reset forgotten passwords
- Manage their profile

**Required Environment Variables:**
- `AUTH_RESEND_KEY` - Resend API key for sending emails
- `SITE_URL` - Your site URL for auth callbacks
- `JWT_PRIVATE_KEY` - PKCS#8 formatted RSA private key (generate with OpenSSL)
- `JWKS` - JSON Web Key Set (generate from private key)

See `backend/ENV_SETUP.md` and `docs/FIX_JWT_PRIVATE_KEY.md` for setup instructions.

## 🤖 AI Agent

The AI Agent uses:
- **Mastra Core Agent** framework with Vercel AI SDK
- **Anthropic Claude** (via Azure Foundry AI) for reasoning
- **System Prompt** from `docs/SYSTEM_PROMPT.md`
- **Vision Capabilities** for image analysis (OCR, context understanding, fraud detection)
- **Tool Calling** for external API integrations:
  - `scanUrl`: VirusTotal API for URL threat scanning
  - `analyzeImage`: Reality Defender API for deepfake detection (when explicitly requested)
  - `analyzeVideo`: Reality Defender API for video deepfake detection
  - `analyzeAudio`: Reality Defender API for audio deepfake detection
  - `webSearch`: Firecrawl API for web search and threat intelligence

**Image Analysis:** When users upload images, the agent automatically uses vision capabilities to:
- Understand image context
- Extract text via OCR
- Analyze for fraud/scam indicators
- Only uses deepfake detection tool when user explicitly requests it

## 🐛 Troubleshooting

### Frontend can't connect to Convex

- Check that `NEXT_PUBLIC_CONVEX_URL` is set in `.env.local`
- Make sure the backend is running (`npx convex dev`)
- Verify the URL is correct (should start with `https://`)

### Authentication errors

- **Missing SITE_URL**: Set `SITE_URL` environment variable in Convex (see `docs/FIX_SITE_URL.md`)
- **Missing JWT_PRIVATE_KEY**: Generate and set PKCS#8 RSA private key (see `docs/FIX_JWT_PRIVATE_KEY.md`)
- **Missing JWKS**: Generate JWKS from private key and set it (see `docs/FIX_JWT_PRIVATE_KEY.md`)
- Verify all auth environment variables: `npx convex env list`

### TypeScript errors in frontend

- Run `npx convex codegen` in the backend folder
- Sync types to frontend (see `SYNC_TYPES.md`)
- Restart the frontend dev server

### Convex functions not found

- Make sure backend is running
- Check that functions are exported correctly
- Verify function names match between backend and frontend

## 📝 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines here]

## 📧 Support

For issues or questions:
1. Check the documentation in `docs/`
2. Review the code comments
3. Check Convex and Next.js documentation

## 🗺️ Roadmap

See `docs/TODO_TASKS.md` for the complete task list and progress tracking.

### Upcoming Features

- Mobile apps (iOS/Android)
- Browser extension
- WhatsApp bot integration
- Advanced analytics dashboard
- API marketplace

## 🙏 Acknowledgments

- Built with [Convex](https://convex.dev)
- UI components from [Shadcn UI](https://ui.shadcn.com)
- Design inspired by modern productivity tools

---

**Made with ❤️ to protect users from online scams**

