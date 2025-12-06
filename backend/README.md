# S.N.O.S. AI Backend

Backend implementation using Convex for the S.N.O.S. AI platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Initialize Convex project:
```bash
npx convex dev
```

This will:
- Create a new Convex deployment (or connect to existing one)
- Generate TypeScript types
- Start watching for changes

3. Configure environment variables:
Copy `.env.example` to `.env` and fill in your API keys:
- `CONVEX_DEPLOYMENT` - Your Convex deployment URL (auto-generated)
- `AZURE_FOUNDRY_BASE_URL` - Azure Foundry AI endpoint
- `AZURE_FOUNDRY_API_KEY` - Azure Foundry AI API key
- `ANTHROPIC_VERSION` - Anthropic API version
- `ANTHROPIC_MODEL` - Model name (e.g., "claude-3-5-sonnet-20241022")
- `REALITY_DEFENDER_API_KEY` - Reality Defender API key
- `VIRUSTOTAL_API_KEY` - VirusTotal API key
- `FIRECRAWL_API_KEY` - Firecrawl API key

## Project Structure

```
backend/
├── convex/
│   ├── schema.ts          # Database schema definitions
│   ├── auth.ts            # Authentication queries
│   ├── users.ts           # User management functions
│   ├── conversations.ts   # Conversation management
│   ├── messages.ts        # Message handling
│   ├── reports.ts         # Community reporting
│   ├── agent.ts           # AI Agent implementation
│   ├── tools.ts           # AI Agent tools (URL scan, deepfake detection, etc.)
│   └── _generated/        # Auto-generated types (do not edit)
├── package.json
├── tsconfig.json
└── .env.example
```

## Database Schema

- **users**: User accounts with subscription plans
- **conversations**: Chat conversations
- **messages**: Messages in conversations
- **reports**: Community reports (phone, URL, email, content)
- **threats**: Verified threats database
- **news**: Scam news articles

## Functions

### Public API

- `auth.getCurrentUser` - Get current authenticated user
- `auth.isAdmin` - Check if user is admin
- `users.createUser` - Create new user
- `users.updateUser` - Update user profile
- `conversations.list` - List user's conversations
- `conversations.create` - Create new conversation
- `messages.list` - List messages in conversation
- `messages.send` - Send message and trigger AI agent
- `reports.create` - Create community report
- `reports.list` - List reports

### Internal Functions

- `agent.investigate` - AI agent investigation (triggered by message.send)
- `tools.scanUrl` - Scan URL via VirusTotal
- `tools.analyzeImage` - Analyze image via Reality Defender
- `tools.analyzeVideo` - Analyze video via Reality Defender
- `tools.analyzeAudio` - Analyze audio via Reality Defender
- `tools.webSearch` - Web search via Firecrawl

## Development

Run the development server:
```bash
npm run dev
```

This will:
- Watch for file changes
- Push updates to your Convex deployment
- Regenerate TypeScript types
- Show function logs

## Deployment

Deploy to production:
```bash
npm run deploy
```

## Next Steps

1. Complete AI Agent implementation in `convex/agent.ts`
2. Implement external API integrations in `convex/tools.ts`
3. Add admin functions for user management and content moderation
4. Set up Convex Auth configuration
5. Test all functions with real API keys

