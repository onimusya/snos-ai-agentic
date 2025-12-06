#!/usr/bin/env node

/**
 * Generate a PKCS#8 formatted RSA private key for JWT_PRIVATE_KEY
 * Usage: node generate-jwt-key.js
 */

const crypto = require('crypto');

try {
  const { privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
  });

  console.log('\n=== JWT_PRIVATE_KEY ===\n');
  console.log(privateKey);
  console.log('\n=== Copy the entire key above (including BEGIN/END lines) ===\n');
  console.log('To set it in Convex production:');
  console.log('  npx convex env set JWT_PRIVATE_KEY "..." --prod');
  console.log('\nOr set it via Convex Dashboard → Settings → Environment Variables\n');
} catch (error) {
  console.error('Error generating key:', error.message);
  process.exit(1);
}

