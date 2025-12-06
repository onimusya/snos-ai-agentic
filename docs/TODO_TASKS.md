# TODO Tasks List
## S.N.O.S. AI - Say No to Online Scam AI

**Last Updated:** 2025-12-06  
**Status:** In Progress  
**Progress:** Phase 1 Complete, Phase 3 Partial

---

## Task Status Legend
- ✅ **Completed**: Task is finished and tested
- 🚧 **In Progress**: Currently working on this task
- ⏳ **Pending**: Not started yet
- 🔄 **Blocked**: Waiting on dependencies or clarification
- ❌ **Cancelled**: Task no longer needed

---

## Phase 1: Foundation & Setup

### Project Setup
- [x] Create project structure
- [x] Generate documentation (PRD, Application Flow, UI Guidelines, Development Plan, TODO)
- [x] Initialize Next.js project in `frontend/`
- [x] Initialize Convex project in `backend/`
- [x] Set up TypeScript configuration
- [x] Configure ESLint and Prettier (via Next.js defaults)
- [ ] Set up Git repository and initial commit

### Convex Setup
- [x] Initialize Convex deployment
- [x] Configure Convex Auth (structure ready, needs full implementation)
- [x] Set up environment variables structure
- [x] Create `.env.example` files

### Frontend Foundation
- [x] Install and configure Next.js 14+ (App Router)
- [x] Install and configure Tailwind CSS
- [x] Set up Shadcn UI components
- [x] Configure design tokens (CSS variables)
- [x] Set up i18n (next-intl installed, needs full configuration)
- [ ] Create translation files (en, ms, zh)
- [x] Set up Convex React client
- [x] Create base layout component
- [x] Create navigation component (in landing page)
- [x] Set up routing structure

### Backend Foundation
- [x] Define database schema (`convex/schema.ts`)
- [x] Create table definitions:
  - [x] `users` table
  - [x] `conversations` table
  - [x] `messages` table
  - [x] `reports` table
  - [x] `threats` table
  - [x] `news` table
- [x] Create database indexes
- [x] Set up authentication functions (getCurrentUser, isAdmin)
- [x] Create base query/mutation structure

---

## Phase 2: Authentication & User Management

### Authentication Pages
- [ ] Create Login page (`/auth/login`)
- [ ] Create Register page (`/auth/register`)
- [ ] Create Forgot Password page (`/auth/forgot-password`)
- [ ] Implement form validation (Zod schemas)
- [ ] Add error handling and user feedback
- [ ] Implement password visibility toggle
- [ ] Add loading states

### Authentication Backend
- [x] Implement `auth.signUp` mutation (via Convex Auth - structure ready)
- [x] Implement `auth.signIn` mutation (via Convex Auth - structure ready)
- [x] Implement `auth.signOut` mutation (via Convex Auth - structure ready)
- [ ] Implement password reset flow
- [x] Set default user role and subscription plan (in users.createUser)
- [x] Add session management (via Convex Auth)

### User Profile
- [ ] Create Profile page (`/profile`)
- [ ] Display user information
- [ ] Show subscription details
- [ ] Display usage statistics
- [ ] Add language preference selector
- [ ] Implement profile update functionality

---

## Phase 3: Landing & Marketing Pages

### Home/Landing Page
- [x] Create Landing page (`/`)
- [x] Implement hero section with CTA
- [x] Add features showcase section
- [ ] Add "How it Works" section (partially done)
- [ ] Add trust indicators section (partially done)
- [x] Add stats section
- [x] Implement footer
- [x] Add navigation with language switcher
- [x] Make responsive (mobile, tablet, desktop)

### Pricing Page
- [ ] Create Pricing page (`/pricing`)
- [ ] Display plan comparison table
- [ ] Show feature breakdown
- [ ] Add CTA buttons for each plan
- [ ] Implement plan selection flow
- [ ] Add pricing information (Free, Pro, Enterprise)

---

## Phase 4: Chat Interface

### Chat Layout
- [ ] Create Chat page (`/chat`)
- [ ] Implement responsive layout:
  - [ ] Mobile: Sheet-based sidebars
  - [ ] Tablet: Resizable left panel, sheet for right panel
  - [ ] Desktop: Three resizable panels
- [ ] Create ChatSidebar component
- [ ] Create ChatHeader component
- [ ] Create ChatMessages component
- [ ] Create ChatInput component
- [ ] Create RiskReportPanel component

### Chat Sidebar
- [ ] Display conversation threads list
- [ ] Show user avatar and profile
- [ ] Display current subscription plan badge
- [ ] Add "Start New Chat" button
- [ ] Implement search functionality
- [ ] Add conversation selection
- [ ] Implement conversation deletion

### Chat Messages
- [ ] Display message history
- [ ] Show user messages (right-aligned)
- [ ] Show AI messages (left-aligned)
- [ ] Display timestamps
- [ ] Show media attachments (images, audio, video)
- [ ] Implement message streaming
- [ ] Add loading indicators

### Chat Input
- [ ] Create text input field
- [ ] Add file attachment button
- [ ] Support image uploads
- [ ] Support audio uploads
- [ ] Support video uploads
- [ ] Add send button
- [ ] Implement file validation
- [ ] Show file previews
- [ ] Add character count (optional)

### Conversation Management
- [x] Implement `conversations.list` query
- [x] Implement `conversations.get` query
- [x] Implement `conversations.create` mutation
- [x] Implement `conversations.delete` mutation (as `remove`)
- [x] Auto-generate conversation titles (default "New Conversation")
- [x] Update conversation timestamps

---

## Phase 5: AI Agent Integration

### Convex Agent Setup
- [ ] Configure Convex Agent
- [ ] Set up system prompt (from `docs/SYSTEM_PROMPT.md`)
- [ ] Configure Anthropic Claude via Azure Foundry AI
- [ ] Set up environment variables for LLM
- [ ] Implement agent initialization

### Message Handling
- [x] Implement `messages.send` action
- [x] Store messages in database (via `messages.create`)
- [ ] Upload media files to Convex Storage (structure ready, needs implementation)
- [x] Trigger AI agent on message send (structure ready)
- [ ] Implement message streaming (needs AI agent implementation)
- [x] Store AI responses (structure ready)

### AI Response Generation
- [ ] Implement `agent.investigate` action
- [ ] Parse user message content
- [ ] Detect content types (text, URL, image, audio, video)
- [ ] Determine required tools
- [ ] Generate AI response with risk assessment
- [ ] Stream response to frontend
- [ ] Update risk report panel

---

## Phase 6: AI Tools Implementation

### URL Scanning Tool
- [ ] Implement `tools.scanUrl` function
- [ ] Integrate VirusTotal API
- [ ] Parse URL scan results
- [ ] Calculate risk score from results
- [ ] Handle API errors gracefully
- [ ] Add rate limiting (if needed)

### Image Analysis Tool
- [ ] Implement `tools.analyzeImage` function
- [ ] Integrate Reality Defender API (image endpoint)
- [ ] Download image from Convex Storage
- [ ] Send to Reality Defender API
- [ ] Parse manipulation detection results
- [ ] Return structured results

### Video Analysis Tool
- [ ] Implement `tools.analyzeVideo` function
- [ ] Integrate Reality Defender API (video endpoint)
- [ ] Download video from Convex Storage
- [ ] Send to Reality Defender API
- [ ] Parse deepfake detection results
- [ ] Handle large video files

### Audio Analysis Tool
- [ ] Implement `tools.analyzeAudio` function
- [ ] Integrate Reality Defender API (audio endpoint)
- [ ] Download audio from Convex Storage
- [ ] Send to Reality Defender API
- [ ] Parse voice cloning detection results
- [ ] Return structured results

### Web Search Tool (Optional)
- [ ] Implement `tools.webSearch` function
- [ ] Integrate Firecrawl API
- [ ] Perform web searches based on content
- [ ] Extract relevant threat intelligence
- [ ] Parse and format results

---

## Phase 7: Risk Assessment & Reporting

### Risk Report Panel
- [ ] Display risk assessment summary
- [ ] Show risk level (High/Medium/Low)
- [ ] Display key findings
- [ ] Show recommended actions
- [ ] Display threat details
- [ ] Add visual risk indicators
- [ ] Make panel collapsible/resizable

### Risk Score Calculation
- [ ] Implement risk scoring algorithm
- [ ] Aggregate results from multiple tools
- [ ] Calculate weighted risk score
- [ ] Determine risk level (High/Medium/Low)
- [ ] Store risk metadata in conversation

### Report Generation
- [ ] Format AI response as structured report
- [ ] Include investigation summary
- [ ] Include risk assessment
- [ ] Include key findings
- [ ] Include recommended actions
- [ ] Include prevention tips

---

## Phase 8: Community Reporting

### Report Creation UI
- [ ] Create "Make Report" button in chat interface
- [ ] Create report dialog/modal
- [ ] Add report type selection (phone, URL, email, content)
- [ ] Add description input
- [ ] Add evidence upload (screenshots, messages)
- [ ] Implement form validation
- [ ] Add submission confirmation

### Report Backend
- [x] Implement `reports.create` mutation
- [x] Store report in database
- [ ] Upload evidence files to Convex Storage (structure ready)
- [x] Set initial status to "pending"
- [ ] Send notification to admins (optional)

### Report Display
- [ ] Show user's submitted reports
- [ ] Display report status
- [ ] Show report history

---

## Phase 9: Admin Console

### Admin Authentication
- [ ] Implement role-based access control
- [ ] Protect admin routes
- [ ] Check admin role in middleware
- [ ] Redirect non-admin users

### Admin Dashboard
- [ ] Create Admin Dashboard page (`/admin`)
- [ ] Display platform statistics:
  - [ ] Total users
  - [ ] Total scans
  - [ ] Total threats detected
  - [ ] Total reports
- [ ] Show recent reports
- [ ] Add quick action buttons
- [ ] Display charts/analytics (optional)

### User Management
- [ ] Create User Management page (`/admin/users`)
- [ ] Display user list with filters
- [ ] Show user roles and permissions
- [ ] Display subscription plans
- [ ] Show account status
- [ ] Implement user actions:
  - [ ] Suspend account
  - [ ] Delete account
  - [ ] Change role
  - [ ] Upgrade/downgrade plan

### Community Reports Review
- [ ] Create Reports Review page (`/admin/reports`)
- [ ] Display pending reports list
- [ ] Show report details and evidence
- [ ] Implement review actions:
  - [ ] Approve (Mark as Verified)
  - [ ] Reject (Mark as Rejected)
  - [ ] Need More Info (Mark as Investigating)
- [ ] Update threat database on approval
- [ ] Add review comments

### Content Moderation
- [ ] Create Content Moderation page (`/admin/content`)
- [ ] Display news articles list
- [ ] Show pending articles
- [ ] Implement content approval workflow
- [ ] Manage threat database:
  - [ ] Add threats manually
  - [ ] Edit threats
  - [ ] Delete threats
- [ ] Add content editing capabilities

---

## Phase 10: Media Handling

### File Upload
- [ ] Implement file upload to Convex Storage
- [ ] Validate file types
- [ ] Validate file sizes
- [ ] Show upload progress
- [ ] Handle upload errors

### Image Handling
- [ ] Display image previews
- [ ] Support multiple image formats (jpg, png, webp)
- [ ] Optimize image display
- [ ] Add image zoom/viewer (optional)

### Audio Handling
- [ ] Create audio player component
- [ ] Support multiple audio formats (mp3, wav, ogg)
- [ ] Display audio waveform (optional)
- [ ] Add playback controls

### Video Handling
- [ ] Create video player component
- [ ] Support multiple video formats (mp4, webm)
- [ ] Add playback controls
- [ ] Display video thumbnails
- [ ] Handle large video files

---

## Phase 11: Multi-Lingual Support

### Translation Files
- [ ] Complete English translations
- [ ] Complete Malay translations
- [ ] Complete Chinese Simplified translations
- [ ] Add missing translation keys
- [ ] Review translations for accuracy

### Language Switcher
- [x] Create LanguageSwitcher component
- [x] Add to navigation
- [ ] Store language preference (needs backend integration)
- [ ] Apply language to all pages (needs i18n full setup)
- [ ] Update UI on language change (needs i18n full setup)

### i18n Integration
- [ ] Integrate i18n in all pages
- [ ] Translate all UI text
- [ ] Translate error messages
- [ ] Translate form labels
- [ ] Translate notifications

---

## Phase 12: Polish & Optimization

### Error Handling
- [ ] Add error boundaries
- [ ] Implement global error handler
- [ ] Show user-friendly error messages
- [ ] Log errors for debugging
- [ ] Handle API errors gracefully
- [ ] Handle network errors

### Loading States
- [ ] Add loading skeletons
- [ ] Show loading indicators
- [ ] Add progress bars for uploads
- [ ] Implement optimistic updates
- [ ] Add loading states for AI responses

### Performance Optimization
- [ ] Optimize images
- [ ] Implement code splitting
- [ ] Lazy load components
- [ ] Optimize database queries
- [ ] Add caching where appropriate
- [ ] Minimize bundle size

### Responsive Design
- [ ] Test on mobile devices
- [ ] Test on tablets
- [ ] Test on desktop
- [ ] Fix responsive issues
- [ ] Optimize touch interactions
- [ ] Test different screen sizes

### Accessibility
- [ ] Add ARIA labels
- [ ] Ensure keyboard navigation
- [ ] Test with screen readers
- [ ] Ensure color contrast
- [ ] Add focus indicators
- [ ] Test accessibility compliance

---

## Phase 13: Testing & QA

### Unit Tests
- [ ] Write tests for utility functions
- [ ] Write tests for validation logic
- [ ] Write tests for AI tool functions
- [ ] Achieve >80% code coverage

### Integration Tests
- [ ] Test API endpoints
- [ ] Test Convex functions
- [ ] Test external API integrations
- [ ] Test authentication flows

### E2E Tests
- [ ] Test user registration flow
- [ ] Test login flow
- [ ] Test chat conversation flow
- [ ] Test media upload flow
- [ ] Test reporting flow
- [ ] Test admin flows

### Manual Testing
- [ ] Test all user flows
- [ ] Test all admin flows
- [ ] Test error scenarios
- [ ] Test edge cases
- [ ] Test on different browsers
- [ ] Test on different devices

---

## Phase 14: Deployment

### Environment Setup
- [ ] Set up production Convex deployment
- [ ] Configure production environment variables
- [ ] Set up Vercel project
- [ ] Configure custom domain (if applicable)

### Deployment
- [ ] Deploy frontend to Vercel
- [ ] Deploy Convex backend
- [ ] Test production deployment
- [ ] Set up CI/CD pipeline
- [ ] Configure automated deployments

### Post-Deployment
- [ ] Monitor error logs
- [ ] Monitor performance
- [ ] Set up analytics
- [ ] Configure monitoring alerts
- [ ] Create backup strategy

---

## Phase 15: Documentation

### Code Documentation
- [ ] Add JSDoc comments to all functions
- [ ] Document complex logic
- [ ] Add inline comments where needed
- [ ] Create README for each major component

### User Documentation
- [ ] Create user guide
- [ ] Write FAQ
- [ ] Create video tutorials (optional)
- [ ] Document common use cases

### Developer Documentation
- [x] Update README.md
- [x] Document setup instructions (SETUP.md)
- [ ] Document deployment process
- [ ] Create architecture diagrams (optional)

---

## Notes & Blockers

### Current Blockers
- None at the moment

### Important Notes
- Always refer to mockup code in `mockup/` folder for design reference
- Follow UI Design Guidelines strictly
- Use Context7 MCP to check latest documentation for frameworks
- Test all external API integrations thoroughly
- Ensure all environment variables are properly configured
- **Type Syncing**: After running `npx convex dev` in backend, sync types to frontend (see `SYNC_TYPES.md`)

### Dependencies
- ✅ Convex project is set up and running
- ✅ Frontend and backend are connected
- ⏳ AI tools require external API keys to be configured
- ⏳ Admin features require authentication and authorization to be complete

### Recent Accomplishments (2025-12-06)
- ✅ Complete project structure and documentation
- ✅ Backend Convex setup with full schema and functions
- ✅ Frontend Next.js setup with design system
- ✅ Landing page implemented
- ✅ Convex connection established
- ✅ Type syncing workflow documented
- ✅ README and setup guides created

---

**Last Updated:** 2025-12-06  
**Next Review:** As tasks are completed

---

## Progress Summary

### ✅ Completed Phases
- **Phase 1: Foundation & Setup** - 100% Complete ✅
  - Project structure ✅
  - Documentation ✅
  - Frontend setup ✅
  - Backend setup ✅
  - Convex deployment ✅
  - Type syncing workflow ✅
  - Frontend-Backend connection ✅
  - TypeScript errors fixed ✅
  - Tailwind CSS v4 configured ✅

### 🚧 In Progress
- **Phase 3: Landing & Marketing Pages** - 80% Complete
  - Landing page ✅
  - Pricing page ⏳

### ⏳ Next Priority Tasks
1. Complete authentication pages (Login, Register, Forgot Password)
2. Build chat interface components
3. Implement AI Agent with Anthropic Claude
4. Integrate external APIs (VirusTotal, Reality Defender, Firecrawl)
5. Create admin console pages

### 📊 Overall Progress
- **Foundation**: 100% ✅
- **Authentication**: 30% 🚧
- **UI Pages**: 20% 🚧
- **AI Integration**: 10% ⏳
- **Admin Console**: 0% ⏳
- **Testing & Deployment**: 0% ⏳

### 🎉 Recent Accomplishments (2025-12-06)
- ✅ Fixed all TypeScript compilation errors in backend
- ✅ Fixed Tailwind CSS v4 configuration issues
- ✅ Resolved Convex API module resolution
- ✅ Set up frontend-backend connection test page
- ✅ Synced Convex types from backend to frontend
- ✅ Created stub files for type resolution
- ✅ Fixed Next.js lock file issues
- ✅ Backend Convex functions ready and deployed
- ✅ Frontend can connect to Convex backend

