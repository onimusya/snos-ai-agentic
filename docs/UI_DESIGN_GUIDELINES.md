# UI Design Guidelines
## S.N.O.S. AI - Say No to Online Scam AI

**Version:** 1.0  
**Date:** 2025-12-06  
**Design Philosophy:** High-Utility Minimalism / Productivity Zen

---

## 1. Design Philosophy

### 1.1 Core Principles
- **High-Utility Minimalism**: Spreadsheet-like precision, stark contrast, content-first
- **Productivity Zen**: Rigorous alignment, minimal distractions
- **Visual Clarity**: Use borders to define hierarchy instead of shadows
- **Functional Aesthetics**: Every visual element serves a purpose

### 1.2 Design Source
This design system replicates the visual aesthetic of the mockup application located in the `mockup` folder. All design decisions should reference the mockup code as the source of truth.

---

## 2. Color System

### 2.1 Color Palette
All colors MUST use HSL format for consistency.

#### Primary Colors
- **Background**: `hsl(0 0% 100%)` (white) - Light mode
- **Foreground**: `hsl(0 0% 0%)` (black) - Light mode
- **Background (Dark)**: `hsl(0 0% 7%)` (near black) - Dark mode
- **Foreground (Dark)**: `hsl(0 0% 95%)` (near white) - Dark mode

#### Accent Colors
- **Violet**: Used for primary actions and highlights
  - Gradient: `from-violet-500 to-cyan-400`
- **Cyan**: Secondary accent color
- **Red**: For destructive actions and high-risk indicators
  - `hsl(0 84% 60%)` - Light mode
  - `hsl(0 62% 30%)` - Dark mode

#### Semantic Colors
- **Border**: `hsl(0 0% 90%)` - Light mode, `hsl(0 0% 20%)` - Dark mode
- **Muted**: `hsl(0 0% 96%)` - Light mode, `hsl(0 0% 15%)` - Dark mode
- **Muted Foreground**: `hsl(0 0% 45%)` - Light mode, `hsl(0 0% 60%)` - Dark mode

#### Threat Level Colors
- **Safe**: `hsl(142 76% 36%)` (green)
- **Warning**: `hsl(45 93% 47%)` (yellow)
- **Danger**: `hsl(0 84% 60%)` (red)

#### Sidebar Colors (Dark Theme)
- **Background**: `hsl(0 0% 7%)` - Light mode, `hsl(0 0% 5%)` - Dark mode
- **Foreground**: `hsl(0 0% 90%)`
- **Border**: `hsl(0 0% 20%)` - Light mode, `hsl(0 0% 18%)` - Dark mode
- **Accent**: `hsl(0 0% 15%)` - Light mode, `hsl(0 0% 12%)` - Dark mode

### 2.2 Color Usage Rules
- Use borders instead of shadows for depth and hierarchy
- Maintain high contrast for readability
- Use accent colors sparingly for emphasis
- Threat levels should use semantic colors consistently

---

## 3. Typography

### 3.1 Font Family
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### 3.2 Font Sizes
- **Hero Title**: `text-5xl md:text-6xl lg:text-7xl` (48px - 72px)
- **Page Title**: `text-3xl md:text-4xl` (30px - 36px)
- **Section Title**: `text-xl md:text-2xl` (20px - 24px)
- **Body Text**: `text-base` (16px)
- **Small Text**: `text-sm` (14px)
- **Caption**: `text-xs` (12px)

### 3.3 Font Weights
- **Bold**: `font-bold` (700) - Headings, emphasis
- **Semibold**: `font-semibold` (600) - Subheadings
- **Medium**: `font-medium` (500) - Navigation, buttons
- **Regular**: `font-normal` (400) - Body text

### 3.4 Line Heights
- **Tight**: `leading-tight` - Headings
- **Normal**: `leading-normal` - Body text
- **Relaxed**: `leading-relaxed` - Long-form content

---

## 4. Spacing System

### 4.1 Padding & Margins
Use Tailwind's spacing scale consistently:
- **xs**: `p-2` (8px)
- **sm**: `p-4` (16px)
- **md**: `p-6` (24px)
- **lg**: `p-8` (32px)
- **xl**: `p-12` (48px)
- **2xl**: `p-24` (96px)

### 4.2 Gap Spacing
- **Small**: `gap-2` (8px) - Tight layouts
- **Medium**: `gap-4` (16px) - Standard layouts
- **Large**: `gap-6` (24px) - Spacious layouts
- **XLarge**: `gap-8` (32px) - Hero sections

---

## 5. Border Radius

### 5.1 Corner Radius Rules
- **Buttons**: Full pill shape - `rounded-full`
- **Cards**: `rounded-md` (6px-8px) - `rounded-xl` for larger cards
- **Inputs**: `rounded-md` (6px-8px)
- **Badges**: `rounded-full` or `rounded-md`
- **Images**: `rounded-md` or `rounded-lg`

### 5.2 Implementation
```css
--radius: 0.5rem; /* 8px - default */
```

---

## 6. Shadows

### 6.1 Shadow Philosophy
**Almost non-existent shadows.** Use borders to define hierarchy instead.

### 6.2 When to Use Shadows
- Minimal use: Only for subtle elevation (e.g., dropdowns, modals)
- Use `shadow-sm` if absolutely necessary
- Prefer border-based hierarchy

### 6.3 Border-Based Hierarchy
- Use `border` and `border-border` for separation
- Use `border-2` for emphasis
- Use different border colors for visual distinction

---

## 7. Component Patterns

### 7.1 Buttons

#### Primary Button
```tsx
<Button className="rounded-full px-6">
  Button Text
</Button>
```
- Full pill shape (`rounded-full`)
- Black background, white text (light mode)
- White background, black text (dark mode)

#### Secondary Button
```tsx
<Button variant="outline" className="rounded-full">
  Button Text
</Button>
```
- Outlined style with border
- Transparent background

#### Ghost Button
```tsx
<Button variant="ghost">
  Button Text
</Button>
```
- No border, transparent background
- Hover state shows background

### 7.2 Cards
```tsx
<Card className="rounded-xl border border-border">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```
- Use `rounded-xl` for cards
- Always include `border border-border`
- No shadows

### 7.3 Inputs
```tsx
<Input className="rounded-md border border-border" />
```
- `rounded-md` (6px-8px)
- Clear border definition
- Focus state with ring

### 7.4 Badges
```tsx
<Badge className="rounded-full bg-muted">
  Badge Text
</Badge>
```
- Use `rounded-full` for pill-shaped badges
- Use semantic colors for threat levels

---

## 8. Layout Patterns

### 8.1 Container Widths
- **Max Width**: `max-w-7xl` (1280px) for main content
- **Content Width**: `max-w-3xl` (768px) for text content
- **Narrow Width**: `max-w-2xl` (672px) for forms

### 8.2 Grid System
- Use CSS Grid for layouts: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Responsive breakpoints:
  - Mobile: Default (no prefix)
  - Tablet: `md:` (768px+)
  - Desktop: `lg:` (1024px+)

### 8.3 Sidebar Layout
- **Desktop**: Resizable panels using `ResizablePanelGroup`
- **Tablet**: Fixed sidebar with resizable panels
- **Mobile**: Sheet/Drawer components for sidebars

---

## 9. Responsive Design

### 9.1 Breakpoints
- **Mobile**: `< 768px` (default)
- **Tablet**: `768px - 1023px` (`md:`)
- **Desktop**: `≥ 1024px` (`lg:`)

### 9.2 Mobile-First Approach
- Design for mobile first
- Use responsive utilities: `flex-col sm:flex-row`
- Hide/show elements: `hidden md:block`

### 9.3 Mobile Patterns
- Navigation: Hamburger menu → Sheet/Drawer
- Sidebars: Convert to Sheets on mobile
- Tables: Scroll horizontally or convert to cards
- Forms: Stack inputs vertically

---

## 10. Chat Interface Design

### 10.1 Layout Structure
- **Left Sidebar**: Conversation threads, user info, subscription badge
- **Center Panel**: Chat messages, input area
- **Right Panel**: Risk report (desktop only)

### 10.2 Sidebar Design
- Dark theme sidebar (`bg-sidebar`)
- High contrast text
- Clear separation with borders
- Scrollable content area

### 10.3 Message Bubbles
- User messages: Right-aligned, distinct background
- AI messages: Left-aligned, different background
- Clear visual distinction
- Timestamp display

### 10.4 Chat Input
- Rounded input field
- Attachment button
- Send button (pill-shaped)
- Clear visual hierarchy

---

## 11. Admin Console Design

### 11.1 Dashboard Layout
- Stats cards in grid layout
- Charts and graphs
- Recent activity feed
- Quick action buttons

### 11.2 Table Design
- Clean borders
- Alternating row colors (subtle)
- Sortable headers
- Action buttons in rows

### 11.3 Form Design
- Clear labels
- Grouped fields
- Validation states
- Submit buttons (pill-shaped)

---

## 12. Animation & Transitions

### 12.1 Transition Philosophy
- Subtle, functional animations
- Fast transitions (150ms - 300ms)
- Ease-in-out timing

### 12.2 Common Transitions
```css
transition-colors duration-200
transition-all duration-300
```

### 12.3 Hover States
- Subtle background color changes
- Border color changes
- Scale effects (minimal)

---

## 13. Accessibility

### 13.1 Color Contrast
- Maintain WCAG AA standards (4.5:1 for text)
- High contrast for all text
- Clear focus indicators

### 13.2 Interactive Elements
- Minimum touch target: 44x44px
- Clear focus states
- Keyboard navigation support

### 13.3 Screen Readers
- Semantic HTML
- ARIA labels where needed
- Alt text for images

---

## 14. Icons

### 14.1 Icon Library
- Use **Lucide React** for all icons
- Consistent icon size: `h-4 w-4`, `h-5 w-5`, `h-6 w-6`

### 14.2 Icon Usage
- Inline with text: `h-4 w-4`
- Button icons: `h-5 w-5`
- Feature icons: `h-6 w-6` or larger

---

## 15. Loading States

### 15.1 Skeleton Loaders
- Use skeleton components for content loading
- Match content structure
- Subtle animation

### 15.2 Spinners
- Minimal, clean spinners
- Use for button loading states
- Consistent size and color

---

## 16. Error States

### 16.1 Error Messages
- Clear, actionable error text
- Use destructive color for errors
- Show inline or in toast notifications

### 16.2 Empty States
- Clear messaging
- Helpful guidance
- Optional illustration or icon

---

## 17. Multi-Lingual Considerations

### 17.1 Text Expansion
- Design for text expansion (up to 30% longer)
- Flexible layouts
- Avoid fixed-width containers for text

### 17.2 RTL Support (Future)
- Consider right-to-left languages
- Flexible layouts that can adapt

---

## 18. Design Tokens Reference

### 18.1 CSS Variables
All design tokens are defined as CSS variables in `globals.css`:
```css
--background
--foreground
--border
--radius
--sidebar-background
--sidebar-foreground
--threat-safe
--threat-warning
--threat-danger
```

### 18.2 Tailwind Configuration
- Use Tailwind's default spacing scale
- Custom colors via CSS variables
- Custom border radius via `--radius`

---

## 19. Implementation Checklist

When implementing components, ensure:
- [ ] Uses borders instead of shadows
- [ ] Buttons are pill-shaped (`rounded-full`)
- [ ] Cards use `rounded-md` or `rounded-xl`
- [ ] High contrast for readability
- [ ] Responsive design (mobile-first)
- [ ] Consistent spacing
- [ ] Semantic HTML
- [ ] Accessible (keyboard navigation, screen readers)
- [ ] Matches mockup design

---

## 20. Design Reference Files

### 20.1 Mockup Location
All design decisions should reference:
- `mockup/src/pages/` - Page components
- `mockup/src/components/` - Reusable components
- `mockup/src/index.css` - Global styles and CSS variables
- `mockup/src/components/ui/` - Shadcn UI components

### 20.2 Key Reference Components
- `mockup/src/pages/Landing.tsx` - Landing page design
- `mockup/src/pages/Chat.tsx` - Chat interface layout
- `mockup/src/components/chat/` - Chat-specific components
- `mockup/src/pages/admin/` - Admin console design

---

**Document Version History**
- v1.0 (2025-12-06): Initial UI design guidelines created

