# Application Flow Documentation
## S.N.O.S. AI - Say No to Online Scam AI

**Version:** 1.0  
**Date:** 2025-12-06

---

## 1. Overview

This document describes the user flows, system flows, and data flows within the S.N.O.S. AI platform. It covers authentication, chat interactions, content analysis, reporting, and administrative workflows.

---

## 2. User Authentication Flow

### 2.1 Registration Flow
```
User → Landing Page → Click "Sign Up" → Register Page
  → Enter Email, Password, Name
  → Submit Registration
  → Convex Auth: Create User Account
  → Set Default Plan: "free"
  → Redirect to Chat Page
```

**Steps:**
1. User navigates to `/auth?mode=register`
2. Fill registration form (email, password, name)
3. Submit form
4. Backend creates user in Convex with:
   - Email, hashed password
   - Default subscription: "free"
   - Role: "user"
   - Created timestamp
5. Auto-login after registration
6. Redirect to `/chat`

### 2.2 Login Flow
```
User → Landing Page → Click "Sign In" → Login Page
  → Enter Email, Password
  → Submit Login
  → Convex Auth: Verify Credentials
  → Create Session
  → Redirect to Chat Page (or intended destination)
```

**Steps:**
1. User navigates to `/auth?mode=login`
2. Enter credentials
3. Backend verifies with Convex Auth
4. Create session token
5. Store user context
6. Redirect to `/chat` or return URL

### 2.3 Password Reset Flow
```
User → Login Page → Click "Forgot Password"
  → Enter Email
  → Submit
  → Backend: Send Reset Email
  → User: Check Email, Click Reset Link
  → Reset Password Page
  → Enter New Password
  → Submit
  → Backend: Update Password
  → Redirect to Login
```

---

## 3. Chat Interface Flow

### 3.1 Starting a New Conversation
```
User → Chat Page → Click "New Chat" Button
  → Clear Current Conversation
  → Show Empty Chat Interface
  → User Types/Uploads Content
  → Submit Message
```

**Backend Process:**
1. Create new conversation document in Convex:
   ```typescript
   {
     _id: Id<"conversations">,
     userId: Id<"users">,
     title: "New Conversation" (or auto-generated from first message),
     createdAt: number,
     updatedAt: number,
     messageCount: 0
   }
   ```
2. Add message to conversation
3. Trigger AI agent analysis

### 3.2 Sending a Text Message
```
User → Chat Input → Type Message → Click Send
  → Frontend: Validate Input
  → Create Message Object
  → Send to Backend
  → Backend: Store Message
  → Trigger AI Agent
  → AI Agent: Analyze Content
  → Generate Response
  → Store AI Response
  → Stream Response to Frontend
  → Update Risk Report Panel
```

**Message Structure:**
```typescript
{
  _id: Id<"messages">,
  conversationId: Id<"conversations">,
  role: "user" | "assistant",
  content: string,
  attachments?: Id<"_storage">[],
  riskScore?: number,
  riskLevel?: "high" | "medium" | "low",
  createdAt: number
}
```

### 3.3 Uploading Media (Image/Audio/Video)
```
User → Chat Input → Click Attach → Select File
  → Frontend: Validate File Type & Size
  → Upload to Convex File Storage
  → Get Storage ID
  → Create Message with Attachment Reference
  → Send to Backend
  → Backend: Store Message
  → Trigger AI Agent with Media
  → AI Agent: Call Deepfake Detection Tool
  → Process Results
  → Generate Response
  → Stream Response
```

**Media Upload Flow:**
1. User selects file (image/audio/video)
2. Frontend validates:
   - File type (jpg, png, mp4, mp3, etc.)
   - File size (max 50MB for video, 10MB for images/audio)
3. Upload to Convex Storage:
   ```typescript
   const storageId = await convex.storage.store(file);
   ```
4. Create message with `attachments: [storageId]`
5. AI agent receives message with attachment
6. Agent calls appropriate tool:
   - `analyzeImage(storageId)` for images
   - `analyzeVideo(storageId)` for videos
   - `analyzeAudio(storageId)` for audio
7. Tool calls Reality Defender API
8. Results aggregated into risk assessment
9. Response generated and streamed

### 3.4 URL Analysis Flow
```
User → Chat Input → Paste URL → Click Send
  → Frontend: Validate URL Format
  → Create Message with URL
  → Send to Backend
  → Backend: Store Message
  → Trigger AI Agent
  → AI Agent: Detect URL in Content
  → Call scanUrl Tool
  → Tool: Query VirusTotal API
  → Get Threat Intelligence
  → AI Agent: Analyze Results
  → Generate Risk Report
  → Stream Response
```

**URL Scanning Process:**
1. User submits URL in message
2. AI agent detects URL pattern
3. Agent calls `scanUrl(url)` tool
4. Tool implementation:
   ```typescript
   async function scanUrl(url: string) {
     // Query VirusTotal API
     const response = await fetch(`https://www.virustotal.com/api/v3/urls/${hash}`, {
       headers: { "X-Apikey": VIRUSTOTAL_API_KEY }
     });
     // Parse results
     return {
       malicious: boolean,
       suspicious: boolean,
       vendorCount: number,
       reputation: number,
       categories: string[]
     };
   }
   ```
5. Results included in AI response
6. Risk score calculated based on results

### 3.5 Risk Report Generation
```
AI Agent Completes Analysis
  → Aggregate Tool Results
  → Calculate Risk Score
  → Generate Structured Response
  → Update Conversation Risk Metadata
  → Stream Response to Frontend
  → Frontend: Parse Response
  → Update Risk Report Panel
  → Highlight Key Findings
```

**Risk Score Calculation:**
- High Risk: Multiple red flags, confirmed threats, high confidence
- Medium Risk: Some suspicious indicators, moderate confidence
- Low Risk: Few or no indicators, likely safe

**Response Structure:**
```
🔍 Investigation Summary
[Brief overview]

⚠️ Risk Assessment: HIGH/MEDIUM/LOW

🚩 Key Findings
- Finding 1
- Finding 2

✅ Recommended Actions
1. Action 1
2. Action 2

📚 Prevention Tips
- Tip 1
- Tip 2
```

---

## 4. AI Agent Investigation Flow

### 4.1 Content Analysis Workflow
```
User Message Received
  → Parse Content Type (text, URL, image, audio, video)
  → Determine Required Tools
  → Execute Tools in Parallel (when possible)
  → Aggregate Results
  → Calculate Risk Score
  → Generate Response
  → Stream to User
```

**Tool Selection Logic:**
- Text only → Content analysis (built-in)
- URL detected → `scanUrl` tool
- Image attachment → `analyzeImage` tool
- Video attachment → `analyzeVideo` tool
- Audio attachment → `analyzeAudio` tool
- Multiple types → Execute all relevant tools

### 4.2 Deepfake Detection Flow (Image)
```
User Uploads Image
  → Store in Convex Storage
  → AI Agent: Call analyzeImage Tool
  → Tool: Download Image from Storage
  → Tool: Call Reality Defender API
  → API: Analyze Image for Manipulation
  → Return Results:
    - manipulationProbability: number
    - confidence: number
    - indicators: string[]
  → AI Agent: Interpret Results
  → Include in Risk Assessment
  → Generate Response
```

### 4.3 Deepfake Detection Flow (Video)
```
User Uploads Video
  → Store in Convex Storage
  → AI Agent: Call analyzeVideo Tool
  → Tool: Download Video from Storage
  → Tool: Call Reality Defender API (Video Endpoint)
  → API: Analyze Video for Deepfake
  → Return Results:
    - deepfakeProbability: number
    - confidence: number
    - frameAnalysis: object[]
  → AI Agent: Interpret Results
  → Generate Response
```

### 4.4 Deepfake Detection Flow (Audio)
```
User Uploads Audio
  → Store in Convex Storage
  → AI Agent: Call analyzeAudio Tool
  → Tool: Download Audio from Storage
  → Tool: Call Reality Defender API (Audio Endpoint)
  → API: Analyze Audio for Voice Cloning
  → Return Results:
    - syntheticVoiceProbability: number
    - confidence: number
    - naturalSpeechIndicators: boolean
  → AI Agent: Interpret Results
  → Generate Response
```

### 4.5 Web Search Flow (via Firecrawl)
```
User Submits Query with Searchable Content
  → AI Agent: Determine Need for Web Search
  → Call webSearch Tool (via Firecrawl)
  → Tool: Query Firecrawl Search API
  → Get Search Results
  → AI Agent: Analyze Results
  → Extract Relevant Threat Intelligence
  → Include in Response
```

---

## 5. Community Reporting Flow

### 5.1 User Reporting Flow
```
User → Chat Page → Click "Make Report" Button
  → Report Dialog Opens
  → Select Report Type (Phone, URL, Email, Content)
  → Enter Details
  → Attach Evidence (Optional)
  → Submit Report
  → Backend: Create Report Document
  → Status: "pending"
  → Show Confirmation
```

**Report Structure:**
```typescript
{
  _id: Id<"reports">,
  userId: Id<"users">,
  type: "phone" | "url" | "email" | "content",
  value: string, // phone number, URL, email, or content text
  description: string,
  evidence?: Id<"_storage">[], // screenshots, messages
  status: "pending" | "verified" | "rejected" | "investigating",
  reviewedBy?: Id<"users">, // admin user ID
  reviewedAt?: number,
  createdAt: number
}
```

### 5.2 Admin Review Flow
```
Admin → Admin Console → Reports Page
  → View Pending Reports List
  → Click Report to Review
  → View Report Details
  → Review Evidence
  → Verify Against Threat Database
  → Make Decision:
    - Approve (Mark as Verified)
    - Reject (Mark as Rejected)
    - Need More Info (Mark as Investigating)
  → Update Report Status
  → If Verified: Update Threat Database
  → Notify User (Optional)
```

**Admin Actions:**
1. View report details and evidence
2. Cross-reference with existing threat database
3. Verify authenticity of report
4. Update report status
5. If verified, add to threat database:
   ```typescript
   {
     _id: Id<"threats">,
     type: "phone" | "url" | "email",
     value: string,
     verified: true,
     verifiedBy: Id<"users">,
     verifiedAt: number,
     reportId: Id<"reports">,
     riskLevel: "high" | "medium" | "low"
   }
   ```

---

## 6. Subscription Management Flow

### 6.1 Viewing Plans
```
User → Pricing Page
  → View Available Plans
  → Compare Features
  → Click "Get Started" or "Upgrade"
```

### 6.2 Upgrading Subscription
```
User → Profile Page → Subscription Section
  → Click "Upgrade Plan"
  → Select Plan (Pro/Enterprise)
  → Redirect to Payment (Stripe/Payment Gateway)
  → Complete Payment
  → Backend: Update User Subscription
  → Update Plan Limits
  → Show Confirmation
```

**Subscription Update:**
```typescript
// Update user document
{
  subscriptionPlan: "pro" | "enterprise",
  subscriptionStatus: "active",
  subscriptionStartDate: number,
  subscriptionEndDate?: number, // for monthly plans
  usageLimit: number // unlimited for paid plans
}
```

### 6.3 Usage Tracking
```
User Performs Scan
  → Check Current Usage
  → Check Plan Limits
  → If Within Limits: Proceed
  → If Exceeded: Show Upgrade Prompt
  → Increment Usage Counter
  → Update User Document
```

---

## 7. Admin Console Flows

### 7.1 Dashboard Access
```
Admin User → Login
  → Check User Role: "admin"
  → Show Admin Navigation
  → Access Admin Dashboard
  → View Statistics
  → Quick Actions
```

**Role Check:**
```typescript
const user = await ctx.auth.getUserIdentity();
const userDoc = await ctx.db
  .query("users")
  .withIndex("email", (q) => q.eq("email", user.email))
  .first();
  
if (userDoc?.role !== "admin") {
  throw new Error("Unauthorized");
}
```

### 7.2 User Management Flow
```
Admin → Admin Console → Users Page
  → View User List
  → Filter/Search Users
  → Click User to View Details
  → View User Activity
  → Actions:
    - Suspend Account
    - Delete Account
    - Change Role
    - Upgrade/Downgrade Plan
```

### 7.3 Content Moderation Flow
```
Admin → Admin Console → Content Page
  → View News Articles
  → Review Pending Articles
  → Approve/Reject
  → Edit Content
  → Manage Threat Database
  → Add/Edit/Delete Threats
```

---

## 8. Multi-Lingual Flow

### 8.1 Language Selection
```
User → Language Switcher (Any Page)
  → Select Language (English/Malay/Chinese)
  → Store Preference in LocalStorage
  → Update i18n Context
  → Re-render UI with Selected Language
```

**Implementation:**
- Use `next-i18next` for Next.js
- Language files in `frontend/locales/`
- Store preference in localStorage
- Apply to all UI text, AI responses (future enhancement)

---

## 9. Error Handling Flows

### 9.1 API Error Flow
```
API Call Fails
  → Catch Error
  → Log Error
  → Show User-Friendly Message
  → Retry (if applicable)
  → Fallback Behavior
```

### 9.2 Media Upload Error
```
Upload Fails
  → Show Error Message
  → Allow Retry
  → Validate File Again
  → Re-attempt Upload
```

### 9.3 AI Agent Error
```
AI Agent Fails
  → Log Error
  → Show Generic Error Message
  → Suggest Retry
  → Fallback: Basic Analysis
```

---

## 10. Data Flow Diagrams

### 10.1 Message Flow
```
Frontend (Chat Input)
  ↓
Next.js API Route
  ↓
Convex Action (sendMessage)
  ↓
Store Message in Database
  ↓
Trigger Convex Agent
  ↓
Agent Calls Tools (if needed)
  ↓
External APIs (Reality Defender, VirusTotal, Firecrawl)
  ↓
Agent Generates Response
  ↓
Store Response in Database
  ↓
Stream to Frontend via Convex Realtime
  ↓
Frontend Updates UI
```

### 10.2 File Upload Flow
```
Frontend (File Select)
  ↓
Validate File
  ↓
Convex Storage API
  ↓
Store File
  ↓
Get Storage ID
  ↓
Create Message with Storage ID
  ↓
Store Message Reference
  ↓
AI Agent Downloads File
  ↓
Process with External API
  ↓
Return Results
```

---

## 11. State Management

### 11.1 Frontend State
- **Conversation State**: Current conversation ID, messages
- **UI State**: Sidebar open/closed, panel sizes, mobile menu
- **User State**: Current user, subscription plan, preferences
- **Language State**: Current language selection

### 11.2 Backend State (Convex)
- **Database**: Users, conversations, messages, reports, threats
- **File Storage**: Media files
- **Realtime Subscriptions**: Active conversation updates

---

## 12. Security Flows

### 12.1 Authentication Flow
```
User Request
  → Check Authentication Token
  → Validate Token with Convex Auth
  → Get User Identity
  → Check Permissions
  → Allow/Deny Access
```

### 12.2 Role-Based Access Control
```
User Action
  → Check User Role
  → Admin Routes: Require "admin" role
  → User Routes: Require "user" or "admin" role
  → Public Routes: No authentication required
```

---

## 13. Performance Optimizations

### 13.1 Caching Strategy
- Cache threat database lookups
- Cache URL scan results (24 hours)
- Cache user subscription status
- Cache language translations

### 13.2 Lazy Loading
- Lazy load conversation history
- Lazy load admin dashboard components
- Lazy load media previews

### 13.3 Streaming
- Stream AI responses for better UX
- Progressive media loading
- Incremental conversation updates

---

**Document Version History**
- v1.0 (2025-12-06): Initial application flow documentation

