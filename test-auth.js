require('dotenv').config();

console.log('=== NextAuth Environment Check ===');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET');

// Test NextAuth import
try {
  const { auth } = require('./app/(auth)/auth.ts');
  console.log('✅ NextAuth import successful');
} catch (error) {
  console.log('❌ NextAuth import failed:', error.message);
}
