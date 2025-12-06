# Fixing Authentication State Update After Magic Link/OTP Callback

## Issue
After successfully logging in with magic link or OTP, the navbar doesn't show the logged-in user's avatar and username. It still shows "Sign In" and "Try Free" buttons.

## Root Cause
After a magic link/OTP callback, Convex Auth processes the authentication server-side, but the client-side Convex queries may not immediately detect the auth state change. This requires a page reload to ensure the ConvexAuthProvider re-initializes with the new auth token.

## Solution Implemented

### 1. Navbar Component (`frontend/components/navbar.tsx`)
- Detects callback parameters (`code`, `token`, `callbackUrl`) in the URL
- Removes query parameters from URL
- Triggers a page reload after 1 second to ensure Convex Auth state is synced

### 2. Home Page (`frontend/app/page.tsx`)
- Also detects callback parameters and triggers reload
- Wrapped `useSearchParams` in Suspense boundary (required by Next.js)

### 3. useAuth Hook (`frontend/hooks/use-auth.ts`)
- Simplified to rely on Convex's reactive queries
- Queries automatically update when auth state changes

## How It Works

1. User clicks magic link or enters OTP
2. Convex Auth processes the callback server-side
3. User is redirected back to the site with callback parameters
4. Navbar/Home page detects the callback parameters
5. Query parameters are removed from URL
6. Page reloads after 1 second
7. On reload, ConvexAuthProvider initializes with the new auth token
8. Queries automatically fetch user data
9. Navbar displays user avatar and username

## Alternative Solutions (If Page Reload Doesn't Work)

### Option 1: Configure CONVEX_SITE_URL
Make sure `CONVEX_SITE_URL` is set in the backend Convex environment:
```bash
cd backend
npx convex env set CONVEX_SITE_URL "https://your-domain.com"
```

### Option 2: Use Convex Auth's Built-in Components
Instead of custom queries, use Convex Auth's built-in components:
- `<Authenticated>` - Shows content when authenticated
- `<Unauthenticated>` - Shows content when not authenticated
- `<AuthLoading>` - Shows loading state

### Option 3: Poll for Auth State
Add a polling mechanism to check auth state periodically after callback:
```typescript
useEffect(() => {
  if (hasCallback) {
    const interval = setInterval(() => {
      // Force query refetch
    }, 1000);
    return () => clearInterval(interval);
  }
}, [hasCallback]);
```

## Testing

1. Sign in with magic link
2. Check email and click the link
3. After redirect, wait 1 second
4. Page should reload
5. Navbar should show user avatar and username

If it still doesn't work:
- Check browser console for errors
- Verify `CONVEX_SITE_URL` is set correctly
- Check that Convex Auth HTTP routes are properly configured
- Verify the callback URL matches your site URL

