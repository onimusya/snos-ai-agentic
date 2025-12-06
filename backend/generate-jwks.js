#!/usr/bin/env node

/**
 * Generate JWKS (JSON Web Key Set) from RSA private key
 * Usage: node generate-jwks.js [path-to-private-key.pem]
 */

const crypto = require('crypto');
const fs = require('fs');

function pemToJWK(privateKeyPem) {
  const key = crypto.createPrivateKey(privateKeyPem);
  const jwk = key.export({ format: 'jwk' });
  
  // JWKS format requires public key in JWK format
  const publicKey = crypto.createPublicKey(privateKeyPem);
  const publicJwk = publicKey.export({ format: 'jwk' });
  
  return {
    kty: publicJwk.kty,
    use: 'sig',
    kid: crypto.createHash('sha256').update(JSON.stringify(publicJwk)).digest('hex').substring(0, 16),
    n: publicJwk.n,
    e: publicJwk.e,
    alg: 'RS256'
  };
}

try {
  const keyPath = process.argv[2] || 'pkcs8_key.pem';
  
  if (!fs.existsSync(keyPath)) {
    console.error(`Error: Key file not found: ${keyPath}`);
    console.error('Usage: node generate-jwks.js [path-to-private-key.pem]');
    process.exit(1);
  }
  
  const privateKeyPem = fs.readFileSync(keyPath, 'utf8');
  const jwk = pemToJWK(privateKeyPem);
  
  const jwks = {
    keys: [jwk]
  };
  
  console.log('\n=== JWKS (JSON Web Key Set) ===\n');
  console.log(JSON.stringify(jwks, null, 2));
  console.log('\n=== Copy the entire JSON above ===\n');
  console.log('To set it in Convex production:');
  console.log('  npx convex env set JWKS \'...\' --prod');
  console.log('\nOr set it via Convex Dashboard → Settings → Environment Variables');
  console.log('(Make sure to set it as a JSON string)\n');
} catch (error) {
  console.error('Error generating JWKS:', error.message);
  process.exit(1);
}

