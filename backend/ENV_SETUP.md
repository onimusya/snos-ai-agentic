# Environment Variables Setup for Convex Backend

## Recommended Method: Using Convex CLI

Convex stores environment variables in your deployment, not in local files. Use the `npx convex env set` command:

```bash
cd backend

# Set Azure Foundry AI variables
# Base URL should be the domain only (e.g., https://your-endpoint.services.ai.azure.com)
# The code will automatically append /anthropic/v1 to the path
npx convex env set AZURE_FOUNDRY_BASE_URL "https://your-endpoint.services.ai.azure.com"
npx convex env set AZURE_FOUNDRY_API_KEY "your-api-key-here"
npx convex env set ANTHROPIC_VERSION "2023-06-01"
npx convex env set ANTHROPIC_MODEL "claude-3-5-sonnet-20241022"

# Set Reality Defender API key
npx convex env set REALITY_DEFENDER_API_KEY "your-api-key-here"

# Set VirusTotal API key
npx convex env set VIRUSTOTAL_API_KEY "your-api-key-here"

# Set Firecrawl API key
npx convex env set FIRECRAWL_API_KEY "your-api-key-here"

# Set Resend API key (for Convex Auth)
npx convex env set AUTH_RESEND_KEY "your-resend-api-key-here"

# Set site URL (for auth callbacks)
npx convex env set SITE_URL "http://localhost:3000"  # For local dev
# Or for production:
# npx convex env set SITE_URL "https://your-domain.com"

# Set JWT Private Key (REQUIRED for authentication)
# Must be PKCS#8 formatted RSA private key (PEM format)
# Generate using OpenSSL:
# openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
# openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in private_key.pem
# Copy the entire output (including BEGIN/END lines) and set it:
npx convex env set JWT_PRIVATE_KEY "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
# Note: For multi-line keys, it's easier to set via Convex Dashboard → Settings → Environment Variables
```

## Verify Environment Variables

To check if a variable is set:

```bash
npx convex env get AZURE_FOUNDRY_API_KEY
```

To list all environment variables:

```bash
npx convex env list
```

## Alternative: Local Development with .env.local

For local development only, you can create a `backend/.env.local` file, but **this is not recommended** because:

1. Convex functions run in the cloud, not locally
2. Environment variables need to be in your Convex deployment
3. The `.env.local` file won't be used by Convex functions

However, if you want to use `.env.local` for local tooling (like scripts), you can create it:

```bash
# backend/.env.local (for local scripts only, NOT used by Convex)
AZURE_FOUNDRY_BASE_URL=https://your-endpoint.openai.azure.com
AZURE_FOUNDRY_API_KEY=your-api-key
ANTHROPIC_VERSION=2023-06-01
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
REALITY_DEFENDER_API_KEY=your-api-key
VIRUSTOTAL_API_KEY=your-api-key
FIRECRAWL_API_KEY=your-api-key
```

**Important:** This file will NOT be used by Convex functions. You still need to set variables using `npx convex env set`.

## Environment Variables Reference

### Required for AI Agent

- `AZURE_FOUNDRY_BASE_URL` - Azure Foundry AI endpoint URL
- `AZURE_FOUNDRY_API_KEY` - Azure Foundry AI API key
- `ANTHROPIC_VERSION` - Anthropic API version (default: "2023-06-01")
- `ANTHROPIC_MODEL` - Model name (e.g., "claude-3-5-sonnet-20241022")

### Required for External Tools

- `REALITY_DEFENDER_API_KEY` - For deepfake detection (images, audio, video)
- `VIRUSTOTAL_API_KEY` - For URL threat scanning
- `FIRECRAWL_API_KEY` - For web search functionality

### Required for Authentication

- `AUTH_RESEND_KEY` - Resend API key for sending magic links and OTPs
- `SITE_URL` - Your site URL for auth callbacks (e.g., "http://localhost:3000" or "https://your-domain.com")
- `JWT_PRIVATE_KEY` - PKCS#8 formatted RSA private key for signing JWT tokens (generate with OpenSSL: `openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048` then `openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in private_key.pem`)

## Production vs Development

Environment variables are stored per Convex deployment. If you have separate dev and prod deployments:

1. **Development deployment**: Set variables using `npx convex dev` (uses your dev deployment)
2. **Production deployment**: Set variables using `npx convex deploy --prod` and then `npx convex env set` (uses your prod deployment)

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use different API keys** for development and production
3. **Rotate keys regularly** if compromised
4. **Use Convex secrets** for sensitive values (they're encrypted at rest)

## Troubleshooting

If environment variables aren't working:

1. Verify they're set: `npx convex env list`
2. Check the variable name matches exactly (case-sensitive)
3. Restart `npx convex dev` after setting new variables
4. Check Convex dashboard → Settings → Environment Variables

