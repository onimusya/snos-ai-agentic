# Product Requirements Document (PRD)
## S.N.O.S. AI - Say No to Online Scam AI

**Version:** 1.0  
**Date:** 2025-12-06  
**Status:** In Development

---

## 1. Executive Summary

S.N.O.S. AI is a conversational AI agent platform designed to protect users from digital fraud and online scams. It functions as an active "Digital Private Investigator," providing multi-modal forensic analysis and real-time threat intelligence powered by GenAI LLM.

### 1.1 Product Vision
Empower everyday users to navigate the digital world safely through compassionate guidance, forensic analysis, and real-time threat detection.

### 1.2 Target Audience
- Primary: General consumers in Malaysia (and globally) who need protection from online scams
- Secondary: Security-conscious individuals, businesses, and organizations
- Tertiary: Security researchers and fraud prevention teams

---

## 2. Product Overview

### 2.1 Core Value Proposition
- **Proactive Protection**: Not just detection, but active investigation and guidance
- **Multi-Modal Analysis**: Text, images, audio, video, and URL analysis
- **Community-Driven**: Crowdsourced threat intelligence
- **Accessible**: Simple chat interface, multi-lingual support
- **Trustworthy**: Transparent risk assessments with actionable recommendations

### 2.2 Key Differentiators
1. Conversational AI interface (not just a scanner)
2. Deepfake detection for all media types
3. Real-time threat intelligence aggregation
4. Community reporting and verification system
5. Malaysian-focused scam patterns and local context

---

## 3. Functional Requirements

### 3.1 Core Features

#### 3.1.1 Chat Interface
- **Description**: Primary interaction method with S.N.O.S. AI agent
- **Requirements**:
  - Real-time chat conversation
  - Support for text messages
  - Support for media attachments (images, audio, video)
  - Support for URL sharing
  - Conversation thread management
  - Search functionality across conversations
  - Risk report generation and display

#### 3.1.2 Content Analysis
- **Text Analysis**:
  - SMS, WhatsApp, Email, Social Media messages
  - Phone numbers
  - Person names
  - Scam pattern detection
  - Social engineering indicators
  
- **Media Analysis**:
  - Image deepfake detection
  - Video deepfake detection
  - Audio/voice clone detection
  - Image authenticity verification

- **URL Analysis**:
  - Phishing detection
  - Malicious website identification
  - Domain reputation checking
  - Threat intelligence lookup

#### 3.1.3 AI Agent Capabilities
- **Investigation Protocol**:
  1. Acknowledge user concerns
  2. Gather context through clarifying questions
  3. Analyze content using appropriate tools
  4. Present findings with risk assessment
  5. Provide actionable guidance

- **Response Structure**:
  - Investigation Summary
  - Risk Assessment (High/Medium/Low)
  - Key Findings
  - Recommended Actions
  - Prevention Tips

#### 3.1.4 Community Reporting
- **User Reporting**:
  - Flag phone numbers as fraud/scam
  - Flag website URLs as phishing/malicious
  - Flag email addresses
  - Report suspicious content
  - Submit evidence (screenshots, messages)

- **Admin Review**:
  - Review and verify reported items
  - Approve/reject reports
  - Update threat database
  - Moderate content

#### 3.1.5 Subscription Management
- **Plans**:
  - Free Plan: Limited scans (5/month), basic features
  - Pro Plan: Unlimited scans, advanced features, priority support
  - Enterprise Plan: Full API access, custom integrations, dedicated support

- **Features**:
  - Plan selection and upgrade/downgrade
  - Usage tracking
  - Billing management
  - Subscription status display

### 3.2 User Interface Pages

#### 3.2.1 Home/Landing Page
- Hero section with value proposition
- Feature showcase
- How it works section
- Trust indicators
- Call-to-action
- Navigation with language switcher

#### 3.2.2 Authentication Pages
- **Register**: Email, password, name
- **Login**: Email/password authentication
- **Forget Password**: Password reset flow

#### 3.2.3 Pricing Page
- Plan comparison table
- Feature breakdown
- Pricing tiers
- CTA buttons for each plan

#### 3.2.4 Chat Page
- **Left Sidebar**:
  - Conversation threads list
  - User avatar and profile
  - Current subscription plan badge
  - "Start New Chat" button
  - Search functionality

- **Center Panel**:
  - Chat header with conversation title
  - Message history
  - Chat input with:
    - Text input
    - Media attachment (images, audio, video)
    - Send button

- **Right Panel** (Risk Report):
  - Risk assessment summary
  - Key findings
  - Recommended actions
  - Threat details

- **Additional Features**:
  - "Make Report" button for community reporting
  - Aggregated scam news feed

#### 3.2.5 User Profile Page
- Account information
- Subscription details
- Usage statistics
- Settings (language, notifications, etc.)
- Account management

#### 3.2.6 Admin Console
- **Dashboard** (`/admin`):
  - Stats overview (users, scans, threats, reports)
  - Recent reports
  - Quick actions
  - Charts and analytics

- **User Management** (`/admin/users`):
  - User list with filters
  - User roles and permissions
  - Subscription plans
  - Account status
  - Actions (suspend, delete, upgrade)

- **Community Reports** (`/admin/reports`):
  - Review reported scams
  - Verify reports
  - Approve/reject submissions
  - Update threat database

- **Content Moderation** (`/admin/content`):
  - Manage news articles
  - Threat database management
  - Content approval workflow

---

## 4. Non-Functional Requirements

### 4.1 Performance
- Chat response time: < 5 seconds for text analysis
- Media analysis: < 30 seconds for images, < 60 seconds for video
- Page load time: < 2 seconds
- Real-time updates for conversation threads

### 4.2 Scalability
- Support 10,000+ concurrent users
- Handle 100,000+ scans per day
- Efficient media file storage and retrieval
- Database optimization for fast queries

### 4.3 Security
- Secure authentication (Convex Auth)
- Encrypted file storage
- API key management for external services
- Role-based access control (RBAC)
- Data privacy compliance

### 4.4 Usability
- Multi-lingual support (English, Malay, Chinese Simplified)
- Responsive design (mobile, tablet, desktop)
- Intuitive navigation
- Clear error messages
- Accessible UI (WCAG 2.1 AA)

### 4.5 Reliability
- 99.9% uptime
- Graceful error handling
- Retry mechanisms for external API calls
- Data backup and recovery

---

## 5. Technical Requirements

### 5.1 Technology Stack

#### Frontend
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: React hooks, React Query
- **Internationalization**: next-i18next
- **Routing**: Next.js App Router

#### Backend
- **Database**: Convex Database
- **File Storage**: Convex File Storage
- **Authentication**: Convex Authentication
- **AI Agent**: Convex Agent + Vercel AI SDK
- **LLM**: Anthropic Claude via Azure Foundry AI

#### External Services
- **Deepfake Detection**: Reality Defender API
- **Threat Intelligence**: VirusTotal API
- **Web Search**: Firecrawl API

### 5.2 System Architecture
- **Frontend**: Next.js application with server-side rendering
- **Backend**: Convex backend functions, actions, and queries
- **AI Agent**: Convex Agent with tool calling capabilities
- **File Storage**: Convex File Storage for media uploads
- **Database Schema**: Users, Conversations, Messages, Reports, Subscriptions, etc.

### 5.3 Integration Requirements
- Azure Foundry AI configuration (base URL, API key, model version)
- Reality Defender API integration
- VirusTotal API integration
- Firecrawl API integration
- Multi-lingual translation files

---

## 6. Design Requirements

### 6.1 Design Philosophy
- **High-Utility Minimalism**: Spreadsheet-like precision, stark contrast
- **Productivity Zen**: Content-first, rigorous alignment
- **Visual Style**:
  - Minimal shadows (use borders for hierarchy)
  - Pill-shaped buttons
  - Rounded-md (6px-8px) for cards and inputs
  - Black & white color scheme with accent colors (violet, cyan)

### 6.2 UI Components
- Consistent component library (Shadcn UI)
- Responsive breakpoints (mobile, tablet, desktop)
- Dark sidebar for navigation
- Resizable panels for desktop layout
- Sheet components for mobile sidebars

---

## 7. User Stories

### 7.1 End User Stories
1. **As a user**, I want to analyze a suspicious WhatsApp message to determine if it's a scam
2. **As a user**, I want to upload a video to check if it's a deepfake
3. **As a user**, I want to scan a URL before clicking to verify it's safe
4. **As a user**, I want to report a phone number as fraudulent so others are protected
5. **As a user**, I want to view my conversation history to reference past analyses
6. **As a user**, I want to switch languages (English/Malay/Chinese) for better understanding

### 7.2 Admin Stories
1. **As an admin**, I want to review user-reported scams to verify and update the threat database
2. **As an admin**, I want to view platform statistics to understand usage patterns
3. **As an admin**, I want to manage user accounts and subscriptions
4. **As an admin**, I want to moderate content and news articles

---

## 8. Success Metrics

### 8.1 User Engagement
- Daily active users (DAU)
- Scans per user per month
- Conversation completion rate
- Feature adoption rate

### 8.2 Platform Performance
- Average response time
- System uptime
- Error rate
- Media processing success rate

### 8.3 Business Metrics
- User acquisition rate
- Subscription conversion rate
- Churn rate
- Revenue per user

### 8.4 Security Metrics
- Threats detected
- False positive rate
- Community report accuracy
- Response time to new threats

---

## 9. Out of Scope (v1.0)

- Mobile native apps (iOS/Android)
- Browser extensions
- API for third-party integrations (Enterprise only)
- Advanced analytics dashboard for end users
- Custom branding for Enterprise
- White-label solutions

---

## 10. Future Enhancements

- Mobile apps (iOS/Android)
- Browser extension
- WhatsApp bot integration
- Telegram bot integration
- Advanced ML model training
- Custom threat intelligence feeds
- API marketplace
- Integration with banking apps
- Real-time scam alerts via push notifications

---

## 11. Dependencies

### 11.1 External Services
- Azure Foundry AI (Anthropic Claude)
- Reality Defender API
- VirusTotal API
- Firecrawl API

### 11.2 Infrastructure
- Convex Cloud (database, storage, auth)
- Vercel (hosting, deployment)
- Domain and SSL certificates

---

## 12. Risks and Mitigation

### 12.1 Technical Risks
- **API Rate Limits**: Implement caching and rate limiting
- **Media Processing Failures**: Retry mechanisms and error handling
- **LLM Response Quality**: System prompt refinement and testing

### 12.2 Business Risks
- **User Trust**: Transparent risk assessments, clear limitations
- **False Positives**: Continuous model improvement, user feedback
- **Competition**: Focus on unique value proposition (conversational AI)

---

## 13. Timeline and Milestones

### Phase 1: Foundation (Weeks 1-2)
- Project setup
- Authentication system
- Basic chat interface
- Database schema

### Phase 2: Core Features (Weeks 3-4)
- AI agent integration
- Media upload and analysis
- URL scanning
- Risk report generation

### Phase 3: Community Features (Week 5)
- Reporting system
- Admin console
- Content moderation

### Phase 4: Polish and Launch (Week 6)
- Multi-lingual support
- UI/UX refinement
- Testing and bug fixes
- Documentation

---

## 14. Approval

**Product Owner**: [TBD]  
**Technical Lead**: [TBD]  
**Design Lead**: [TBD]  
**Date**: 2025-12-06

---

**Document Version History**
- v1.0 (2025-12-06): Initial PRD created

