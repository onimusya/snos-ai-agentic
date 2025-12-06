# S.N.O.S. AI Frontend

Next.js frontend application for the S.N.O.S. AI platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Copy `.env.local.example` to `.env.local` and add your Convex deployment URL:
```bash
cp .env.local.example .env.local
```

Then add:
```
NEXT_PUBLIC_CONVEX_URL=your-convex-deployment-url
```

To get your Convex URL:
1. Go to the `backend` folder
2. Run `npx convex dev`
3. Copy the deployment URL from the output
4. Add it to `frontend/.env.local`

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout with Convex provider
│   └── globals.css        # Global styles and design system
├── components/
│   ├── ui/                # Shadcn UI components
│   ├── providers/         # React providers (Convex, etc.)
│   └── language-switcher.tsx
├── hooks/
│   ├── use-auth.ts        # Authentication hook
│   └── use-convex-query.ts # Convex query hooks
├── lib/
│   ├── convex.ts         # Convex client setup
│   └── utils.ts          # Utility functions
└── convex/
    └── _generated/       # Convex generated types (auto-generated)
```

## Features

- ✅ Next.js 16 with App Router
- ✅ Tailwind CSS with custom design system
- ✅ Shadcn UI components
- ✅ Convex integration (ready to connect)
- ✅ Responsive design
- ✅ Landing page

## Next Steps

1. **Connect to Convex Backend:**
   - Run `npx convex dev` in the `backend` folder
   - Copy the deployment URL to `frontend/.env.local`
   - The Convex types will be auto-generated

2. **Set up Authentication:**
   - Configure Convex Auth in the backend
   - Implement login/register pages
   - Add protected routes

3. **Build Pages:**
   - Authentication pages (login, register, forgot password)
   - Chat interface
   - User profile
   - Admin console
   - Pricing page

4. **Add i18n:**
   - Set up next-intl
   - Create translation files (en, ms, zh)
   - Add translations to all pages

## Design System

The design follows the "High-Utility Minimalism" philosophy:
- Minimal shadows (use borders for hierarchy)
- Pill-shaped buttons (`rounded-full`)
- Rounded corners for cards (`rounded-md` or `rounded-xl`)
- High contrast black & white with accent colors (violet, cyan)
- Dark sidebar for navigation

All colors use HSL format and are defined in `app/globals.css`.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Notes

- The Convex client is set up but needs the backend to be running
- Authentication hooks are placeholders until Convex Auth is configured
- UI components are ready to use from Shadcn UI
- Design system matches the mockup in the `mockup/` folder
