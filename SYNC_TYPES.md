# Syncing Convex Types to Frontend

After running `npx convex dev` in the backend folder, you need to sync the generated types to the frontend.

## Quick Sync Command

Run this from the project root:

```bash
cp backend/convex/_generated/api.d.ts frontend/convex/_generated/api.d.ts
cp backend/convex/_generated/api.js frontend/convex/_generated/api.js
cp backend/convex/_generated/server.d.ts frontend/convex/_generated/server.d.ts
cp backend/convex/_generated/dataModel.d.ts frontend/convex/_generated/dataModel.d.ts
```

## Automated Sync Script

You can create a script to automate this. Create `sync-types.sh`:

```bash
#!/bin/bash
echo "Syncing Convex types from backend to frontend..."
cp backend/convex/_generated/api.d.ts frontend/convex/_generated/api.d.ts
cp backend/convex/_generated/api.js frontend/convex/_generated/api.js
cp backend/convex/_generated/server.d.ts frontend/convex/_generated/server.d.ts
cp backend/convex/_generated/dataModel.d.ts frontend/convex/_generated/dataModel.d.ts
echo "Types synced successfully!"
```

Make it executable:
```bash
chmod +x sync-types.sh
```

Then run:
```bash
./sync-types.sh
```

## Alternative: Symlink (Advanced)

For automatic syncing, you can create a symlink (but this may cause issues with some tools):

```bash
# Remove the frontend _generated folder
rm -rf frontend/convex/_generated

# Create symlink
ln -s ../../backend/convex/_generated frontend/convex/_generated
```

## When to Sync

Sync types whenever you:
- Add new Convex functions
- Change function signatures
- Update the database schema
- Run `npx convex dev` in the backend

The types are automatically regenerated when you run `npx convex dev`, so you just need to copy them to the frontend.

