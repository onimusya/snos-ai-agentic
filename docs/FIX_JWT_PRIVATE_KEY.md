# Fix: JWT_PRIVATE_KEY Error

## Error Messages

If you're seeing one of these errors:

1. **Missing JWT_PRIVATE_KEY:**
   ```
   Uncaught Error: Missing environment variable `JWT_PRIVATE_KEY`
   ```

2. **Invalid Format:**
   ```
   Uncaught TypeError: "pkcs8" must be PKCS#8 formatted string
   ```

**The `JWT_PRIVATE_KEY` must be a PKCS#8 formatted RSA private key, not a random string.**

## Immediate Fix

### Step 1: Generate a PKCS#8 Private Key

Generate an RSA private key in PKCS#8 format using one of these methods:

#### Option A: Using OpenSSL (Recommended)
```bash
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in private_key.pem -out pkcs8_key.pem
cat pkcs8_key.pem
```

This will output a key that looks like:
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
-----END PRIVATE KEY-----
```

#### Option B: Using Node.js Script
Create a file `generate-jwt-key.js`:
```javascript
const crypto = require('crypto');
const { promisify } = require('util');
const generateKeyPair = promisify(crypto.generateKeyPair);

generateKeyPair('rsa', {
  modulusLength: 2048,
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
}).then(({ privateKey }) => {
  console.log(privateKey);
});
```

Then run:
```bash
node generate-jwt-key.js
```

#### Option C: One-liner with Node.js
```bash
node -e "const crypto = require('crypto'); crypto.generateKeyPairSync('rsa', { modulusLength: 2048, privateKeyEncoding: { type: 'pkcs8', format: 'pem' }, publicKeyEncoding: { type: 'spki', format: 'pem' } }, (err, publicKey, privateKey) => { if (!err) console.log(privateKey); });"
```

### Step 2: Set the JWT_PRIVATE_KEY

Copy the entire key including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines:

```bash
cd backend
npx convex env set JWT_PRIVATE_KEY "-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
(entire key content)
...
-----END PRIVATE KEY-----" --prod
```

**Important:** The key must include the header and footer lines, and be on a single line or properly escaped.

## Verify It's Set

```bash
npx convex env get JWT_PRIVATE_KEY --prod
```

## Important Notes

1. **Keep it secret**: The JWT_PRIVATE_KEY is used to sign authentication tokens. Never commit it to version control.

2. **Format**: Must be PKCS#8 formatted RSA private key (PEM format), not a random string.

3. **Include headers**: The key must include `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines.

4. **Key size**: Use at least 2048-bit RSA keys for security.

5. **Multi-line handling**: When setting via CLI, you may need to escape newlines or use a single line. Alternatively, you can set it via Convex Dashboard → Settings → Environment Variables.

## After Setting

1. The error should disappear immediately
2. Try OTP verification again
3. Authentication should work correctly

## For Development

If you're also missing this in development, set it for your dev deployment:

```bash
npx convex env set JWT_PRIVATE_KEY "your-generated-key-here"
```

(Without the `--prod` flag, it sets for the dev deployment)

