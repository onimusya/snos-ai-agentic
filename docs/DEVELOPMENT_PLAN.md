# Development Plan
## S.N.O.S. AI - Say No to Online Scam AI

**Version:** 1.0  
**Date:** 2025-12-06  
**Status:** In Development

---

## 1. Overview

This document outlines the technical development plan for building the S.N.O.S. AI platform. It includes architecture decisions, technology stack specifications, implementation phases, and technical requirements.

---

## 2. Technology Stack

### 2.1 Frontend Stack

#### Core Framework
- **Next.js 14+** (App Router)
  - Server-side rendering (SSR)
  - Server components for performance
  - API routes for backend integration
  - File-based routing

#### Styling & UI
- **Tailwind CSS 3.4+**
  - Utility-first CSS framework
  - Custom design tokens via CSS variables
  - Responsive breakpoints (mobile-first)

- **Shadcn UI**
  - Component library built on Radix UI
  - Fully customizable components
  - Accessible by default
  - Copy-paste component model

#### State Management
- **React Hooks** (useState, useEffect, useContext)
- **Convex React Hooks** (useQuery, useMutation, useAction)
- **React Query** (for complex data fetching patterns)

#### Internationalization
- **next-i18next** or **next-intl**
  - Multi-lingual support (English, Malay, Chinese Simplified)
  - Translation files in `frontend/locales/`
  - Language switcher component

#### Form Handling
- **React Hook Form**
- **Zod** (schema validation)

#### Icons
- **Lucide React** (consistent icon library)

### 2.2 Backend Stack

#### Database & Backend
- **Convex**
  - Database: Real-time database with automatic reactivity
  - File Storage: Built-in file storage for media uploads
  - Authentication: Convex Auth for user management
  - Functions: Queries, mutations, actions, and agents

#### AI & LLM
- **Convex Agent** (for AI agent orchestration)
- **Vercel AI SDK** (for streaming responses)
- **Anthropic Claude** (via Azure Foundry AI)
  - Configuration via environment variables:
    - `AZURE_FOUNDRY_BASE_URL`
    - `AZURE_FOUNDRY_API_KEY`
    - `ANTHROPIC_VERSION`
    - `ANTHROPIC_MODEL` (e.g., "claude-3-5-sonnet-20241022")

#### External Service Integrations
- **Reality Defender API** (Deepfake detection)
  - Image analysis endpoint
  - Video analysis endpoint
  - Audio analysis endpoint
  - API key via environment variable

- **VirusTotal API** (Threat intelligence)
  - URL scanning endpoint
  - Domain reputation checking
  - API key via environment variable

- **Firecrawl API** (Web search)
  - Search functionality
  - Content scraping
  - API key via environment variable

### 2.3 Development Tools

#### Package Management
- **npm** or **pnpm** (preferred)

#### TypeScript
- **TypeScript 5.8+**
  - Strict mode enabled
  - Type safety for all code

#### Code Quality
- **ESLint** (linting)
- **Prettier** (code formatting)

#### Version Control
- **Git** (with conventional commits)

---

## 3. Project Structure

### 3.1 Frontend Structure (`frontend/`)

```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (group)
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/       # Protected routes (group)
│   │   ├── chat/
│   │   ├── profile/
│   │   └── admin/        # Admin routes
│   │       ├── dashboard/
│   │       ├── users/
│   │       ├── reports/
│   │       └── content/
│   ├── pricing/
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home/Landing page
├── components/
│   ├── ui/               # Shadcn UI components
│   ├── chat/             # Chat-specific components
│   │   ├── ChatSidebar.tsx
│   │   ├── ChatHeader.tsx
│   │   ├── ChatMessages.tsx
│   │   ├── ChatInput.tsx
│   │   └── RiskReportPanel.tsx
│   ├── admin/            # Admin components
│   └── shared/           # Shared components
├── lib/
│   ├── convex/           # Convex client setup
│   ├── utils.ts          # Utility functions
│   └── i18n.ts           # i18n configuration
├── locales/              # Translation files
│   ├── en/
│   ├── ms/
│   └── zh/
├── hooks/                # Custom React hooks
├── types/                # TypeScript types
├── public/               # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

### 3.2 Backend Structure (`backend/`)

```
backend/
├── convex/
│   ├── schema.ts         # Database schema definitions
│   ├── auth.ts           # Authentication configuration
│   ├── users.ts          # User-related functions
│   ├── conversations.ts  # Conversation functions
│   ├── messages.ts       # Message functions
│   ├── reports.ts        # Community reporting functions
│   ├── admin.ts          # Admin functions
│   ├── agent.ts          # AI Agent configuration
│   ├── tools.ts          # AI Agent tools
│   │   ├── scanUrl       # VirusTotal integration
│   │   ├── analyzeImage  # Reality Defender (image)
│   │   ├── analyzeVideo  # Reality Defender (video)
│   │   └── analyzeAudio  # Reality Defender (audio)
│   └── _generated/       # Convex generated files
├── .env.example          # Environment variables template
├── package.json
└── tsconfig.json
```

---

## 4. Database Schema

### 4.1 Tables

#### `users`
```typescript
{
  _id: Id<"users">,
  _creationTime: number,
  email: string,
  name?: string,
  role: "user" | "admin",
  subscriptionPlan: "free" | "pro" | "enterprise",
  subscriptionStatus: "active" | "inactive" | "cancelled",
  subscriptionStartDate?: number,
  subscriptionEndDate?: number,
  usageCount: number, // Monthly scan count
  language: "en" | "ms" | "zh",
  avatarUrl?: string
}
```

#### `conversations`
```typescript
{
  _id: Id<"conversations">,
  _creationTime: number,
  userId: Id<"users">,
  title: string,
  updatedAt: number,
  messageCount: number,
  riskLevel?: "high" | "medium" | "low",
  riskScore?: number
}
```

#### `messages`
```typescript
{
  _id: Id<"messages">,
  _creationTime: number,
  conversationId: Id<"conversations">,
  role: "user" | "assistant",
  content: string,
  attachments?: Id<"_storage">[], // Convex storage IDs
  riskLevel?: "high" | "medium" | "low",
  riskScore?: number,
  toolCalls?: Array<{
    tool: string,
    input: any,
    output: any
  }>
}
```

#### `reports`
```typescript
{
  _id: Id<"reports">,
  _creationTime: number,
  userId: Id<"users">,
  type: "phone" | "url" | "email" | "content",
  value: string,
  description: string,
  evidence?: Id<"_storage">[],
  status: "pending" | "verified" | "rejected" | "investigating",
  reviewedBy?: Id<"users">,
  reviewedAt?: number
}
```

#### `threats`
```typescript
{
  _id: Id<"threats">,
  _creationTime: number,
  type: "phone" | "url" | "email",
  value: string,
  verified: boolean,
  verifiedBy: Id<"users">,
  verifiedAt: number,
  reportId: Id<"reports">,
  riskLevel: "high" | "medium" | "low"
}
```

#### `news` (for scam news feed)
```typescript
{
  _id: Id<"news">,
  _creationTime: number,
  title: string,
  content: string,
  source?: string,
  url?: string,
  publishedAt: number,
  status: "draft" | "published",
  createdBy: Id<"users">
}
```

### 4.2 Indexes

- `users`: Index on `email` (unique)
- `conversations`: Index on `userId`, `updatedAt`
- `messages`: Index on `conversationId`, `_creationTime`
- `reports`: Index on `userId`, `status`, `type`
- `threats`: Index on `type`, `value` (unique), `verified`

---

## 5. API & Function Specifications

### 5.1 Authentication Functions

#### `auth.signUp`
- **Type**: Mutation
- **Args**: `{ email: string, password: string, name?: string }`
- **Returns**: `{ userId: Id<"users"> }`
- **Description**: Register new user with Convex Auth

#### `auth.signIn`
- **Type**: Mutation
- **Args**: `{ email: string, password: string }`
- **Returns**: `{ sessionId: string }`
- **Description**: Authenticate user

#### `auth.signOut`
- **Type**: Mutation
- **Args**: `{}`
- **Returns**: `v.null()`
- **Description**: Sign out current user

### 5.2 Conversation Functions

#### `conversations.list`
- **Type**: Query
- **Args**: `{}`
- **Returns**: `Array<Conversation>`
- **Description**: List user's conversations

#### `conversations.get`
- **Type**: Query
- **Args**: `{ conversationId: Id<"conversations"> }`
- **Returns**: `Conversation | null`
- **Description**: Get conversation details

#### `conversations.create`
- **Type**: Mutation
- **Args**: `{ title?: string }`
- **Returns**: `{ conversationId: Id<"conversations"> }`
- **Description**: Create new conversation

#### `conversations.delete`
- **Type**: Mutation
- **Args**: `{ conversationId: Id<"conversations"> }`
- **Returns**: `v.null()`
- **Description**: Delete conversation

### 5.3 Message Functions

#### `messages.list`
- **Type**: Query
- **Args**: `{ conversationId: Id<"conversations"> }`
- **Returns**: `Array<Message>`
- **Description**: List messages in conversation

#### `messages.send`
- **Type**: Action
- **Args**: `{ conversationId: Id<"conversations">, content: string, attachments?: File[] }`
- **Returns**: `v.null()`
- **Description**: Send message and trigger AI agent

### 5.4 AI Agent Functions

#### `agent.investigate`
- **Type**: Action (Internal)
- **Args**: `{ conversationId: Id<"conversations">, messageId: Id<"messages"> }`
- **Returns**: `v.null()`
- **Description**: Trigger AI agent investigation

#### `agent.streamResponse`
- **Type**: Action
- **Args**: `{ conversationId: Id<"conversations"> }`
- **Returns**: `AsyncIterable<string>`
- **Description**: Stream AI response

### 5.5 Tool Functions

#### `tools.scanUrl`
- **Type**: Action (Internal)
- **Args**: `{ url: string }`
- **Returns**: `{ malicious: boolean, suspicious: boolean, vendorCount: number, reputation: number }`
- **Description**: Scan URL via VirusTotal

#### `tools.analyzeImage`
- **Type**: Action (Internal)
- **Args**: `{ storageId: Id<"_storage"> }`
- **Returns**: `{ manipulationProbability: number, confidence: number, indicators: string[] }`
- **Description**: Analyze image via Reality Defender

#### `tools.analyzeVideo`
- **Type**: Action (Internal)
- **Args**: `{ storageId: Id<"_storage"> }`
- **Returns**: `{ deepfakeProbability: number, confidence: number, frameAnalysis: object[] }`
- **Description**: Analyze video via Reality Defender

#### `tools.analyzeAudio`
- **Type**: Action (Internal)
- **Args**: `{ storageId: Id<"_storage"> }`
- **Returns**: `{ syntheticVoiceProbability: number, confidence: number, naturalSpeechIndicators: boolean }`
- **Description**: Analyze audio via Reality Defender

### 5.6 Report Functions

#### `reports.create`
- **Type**: Mutation
- **Args**: `{ type: string, value: string, description: string, evidence?: File[] }`
- **Returns**: `{ reportId: Id<"reports"> }`
- **Description**: Create community report

#### `reports.list`
- **Type**: Query
- **Args**: `{ status?: string }`
- **Returns**: `Array<Report>`
- **Description**: List reports (admin only)

#### `reports.review`
- **Type**: Mutation
- **Args**: `{ reportId: Id<"reports">, status: string }`
- **Returns**: `v.null()`
- **Description**: Review report (admin only)

### 5.7 Admin Functions

#### `admin.stats`
- **Type**: Query
- **Args**: `{}`
- **Returns**: `{ users: number, scans: number, threats: number, reports: number }`
- **Description**: Get platform statistics (admin only)

#### `admin.users.list`
- **Type**: Query
- **Args**: `{ limit?: number, offset?: number }`
- **Returns**: `Array<User>`
- **Description**: List all users (admin only)

---

## 6. Environment Variables

### 6.1 Frontend (.env.local)

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# i18n
NEXT_PUBLIC_DEFAULT_LOCALE=en
```

### 6.2 Backend (.env)

```bash
# Convex
CONVEX_DEPLOYMENT=your-deployment

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

---

## 7. Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [x] Project setup and configuration
- [ ] Convex project initialization
- [ ] Database schema definition
- [ ] Authentication system (Convex Auth)
- [ ] Basic Next.js app structure
- [ ] Shadcn UI component setup
- [ ] Tailwind CSS configuration
- [ ] i18n setup

### Phase 2: Core Features (Week 3-4)
- [ ] Home/Landing page
- [ ] Authentication pages (Login, Register, Forgot Password)
- [ ] Pricing page
- [ ] Chat interface (basic)
- [ ] Conversation management
- [ ] Message sending/receiving
- [ ] Convex Agent setup
- [ ] AI response streaming

### Phase 3: AI Integration (Week 5-6)
- [ ] Tool implementations (scanUrl, analyzeImage, analyzeVideo, analyzeAudio)
- [ ] External API integrations (VirusTotal, Reality Defender, Firecrawl)
- [ ] Risk assessment logic
- [ ] Risk report generation
- [ ] System prompt integration

### Phase 4: Media Handling (Week 7)
- [ ] File upload to Convex Storage
- [ ] Image preview and display
- [ ] Audio/video player components
- [ ] Media attachment handling in messages

### Phase 5: Community Features (Week 8)
- [ ] Report creation UI
- [ ] Report submission flow
- [ ] Admin report review interface
- [ ] Threat database management

### Phase 6: Admin Console (Week 9)
- [ ] Admin dashboard
- [ ] User management
- [ ] Content moderation
- [ ] Statistics and analytics

### Phase 7: Polish & Testing (Week 10)
- [ ] Multi-lingual support (English, Malay, Chinese)
- [ ] Responsive design refinement
- [ ] Error handling
- [ ] Loading states
- [ ] Testing and bug fixes
- [ ] Performance optimization

---

## 8. Technical Decisions

### 8.1 Why Next.js App Router?
- Modern React patterns
- Server components for performance
- Built-in API routes
- Excellent TypeScript support
- SEO-friendly

### 8.2 Why Convex?
- Real-time database with automatic reactivity
- Built-in authentication
- File storage included
- Agent framework for AI
- Type-safe API
- No backend infrastructure management

### 8.3 Why Vercel AI SDK?
- Streaming support
- Tool calling abstraction
- Multiple LLM provider support
- Excellent TypeScript support

### 8.4 Why Shadcn UI?
- Fully customizable
- Accessible by default
- Copy-paste model (no npm dependency)
- Built on Radix UI primitives
- Matches design system requirements

---

## 9. Security Considerations

### 9.1 Authentication
- Use Convex Auth (secure by default)
- Password hashing handled by Convex
- Session management via Convex

### 9.2 Authorization
- Role-based access control (RBAC)
- Admin routes protected by role check
- User data isolation (users can only access their own data)

### 9.3 API Keys
- Store all API keys in environment variables
- Never expose API keys to frontend
- Use Convex environment variables for backend

### 9.4 File Uploads
- Validate file types and sizes
- Scan uploaded files for malware (future enhancement)
- Limit file sizes (50MB for video, 10MB for images/audio)

### 9.5 Input Validation
- Validate all user inputs
- Use Zod schemas for validation
- Sanitize user-generated content

---

## 10. Performance Optimization

### 10.1 Frontend
- Use Next.js server components
- Implement code splitting
- Lazy load heavy components
- Optimize images
- Use React.memo for expensive components

### 10.2 Backend
- Optimize database queries
- Use indexes effectively
- Cache external API responses (where possible)
- Implement pagination for large datasets

### 10.3 AI Agent
- Stream responses for better UX
- Cache tool results when appropriate
- Parallelize tool calls when possible

---

## 11. Testing Strategy

### 11.1 Unit Tests
- Test utility functions
- Test validation logic
- Test AI tool functions

### 11.2 Integration Tests
- Test API endpoints
- Test Convex functions
- Test external API integrations

### 11.3 E2E Tests
- Test user flows (authentication, chat, reporting)
- Test admin flows
- Test responsive design

---

## 12. Deployment

### 12.1 Frontend
- Deploy to Vercel
- Configure environment variables
- Set up custom domain

### 12.2 Backend
- Deploy Convex to Convex Cloud
- Configure environment variables
- Set up production database

### 12.3 CI/CD
- GitHub Actions for automated testing
- Automated deployment on merge to main

---

## 13. Monitoring & Analytics

### 13.1 Error Tracking
- Sentry or similar for error tracking
- Log all errors to Convex

### 13.2 Analytics
- Track user engagement
- Monitor API usage
- Track conversion rates

### 13.3 Performance Monitoring
- Monitor response times
- Track database query performance
- Monitor external API latency

---

## 14. Documentation Requirements

### 14.1 Code Documentation
- JSDoc comments for all functions
- README files for each major component
- Architecture decision records (ADRs)

### 14.2 User Documentation
- User guide
- FAQ
- API documentation (if applicable)

---

## 15. Future Enhancements

### 15.1 Phase 2 Features
- Mobile apps (iOS/Android)
- Browser extension
- WhatsApp bot integration
- Advanced analytics dashboard

### 15.2 Technical Improvements
- Advanced caching strategies
- CDN for media files
- WebSocket for real-time updates
- GraphQL API (if needed)

---

**Document Version History**
- v1.0 (2025-12-06): Initial development plan created

