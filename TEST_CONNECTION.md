# Testing Frontend-Backend Connection

This guide will help you test if the frontend can successfully connect to the Convex backend.

## Quick Test Steps

### 1. Start the Backend

Open Terminal 1:
```bash
cd backend
npx convex dev
```

Wait for it to show:
```
✔ Convex functions ready!
```

**Important**: Copy the `CONVEX_URL` from the output (e.g., `https://exciting-ptarmigan-195.convex.cloud`)

### 2. Configure Frontend Environment

Create or update `frontend/.env.local`:
```bash
cd frontend
```

Create the file:
```bash
echo "NEXT_PUBLIC_CONVEX_URL=https://your-deployment-url.convex.cloud" > .env.local
```

Replace `https://your-deployment-url.convex.cloud` with the actual URL from step 1.

### 3. Start the Frontend

Open Terminal 2:
```bash
cd frontend
npm run dev
```

### 4. Test the Connection

Open your browser and navigate to:
```
http://localhost:3000/test-connection
```

You should see:
- ✅ **"Connected to Convex!"** - if everything is working
- ❌ **"Connection Error"** - if there's a problem

## What the Test Page Shows

The test page will display:

1. **Connection Status**: Whether the frontend can reach Convex
2. **Environment Configuration**: Shows if `NEXT_PUBLIC_CONVEX_URL` is set
3. **Query Results**: 
   - Current User Query (should return `null` if not logged in - this is normal!)
   - Is Admin Query (should return `false` if not logged in - this is normal!)

## Expected Results

### ✅ Success Indicators

- Connection Status shows "Connected to Convex!"
- Environment shows "Set" for Convex URL
- Query Results show "Query Successful" (even if user is null)
- No errors in browser console

### ❌ Common Issues

**Issue: "Connection Error" or queries stuck on "Loading..."**

**Solutions:**
1. Check that backend is running (`npx convex dev` in backend folder)
2. Verify `NEXT_PUBLIC_CONVEX_URL` in `frontend/.env.local` matches backend URL
3. Restart frontend dev server after updating `.env.local`
4. Check browser console for errors

**Issue: "NEXT_PUBLIC_CONVEX_URL is not set"**

**Solution:**
1. Create `frontend/.env.local` file
2. Add: `NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud`
3. Restart frontend dev server

**Issue: Queries return null/undefined**

**Note**: This is **NORMAL** if you haven't implemented authentication yet! The queries are working correctly - they're just returning `null` because there's no logged-in user.

## Manual Test in Browser Console

You can also test directly in the browser console:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Type:
```javascript
// Check if Convex client is available
window.convex
```

If you see the Convex client object, the connection is working!

## Next Steps

Once the connection is confirmed:
1. ✅ Frontend can communicate with backend
2. ✅ Queries are working
3. ⏳ Next: Implement authentication pages
4. ⏳ Next: Build chat interface
5. ⏳ Next: Connect AI agent

## Troubleshooting

### Backend not starting?

```bash
cd backend
npm install  # Make sure dependencies are installed
npx convex dev
```

### Frontend not starting?

```bash
cd frontend
npm install  # Make sure dependencies are installed
npm run dev
```

### Types not syncing?

See `SYNC_TYPES.md` for instructions on syncing Convex types from backend to frontend.

