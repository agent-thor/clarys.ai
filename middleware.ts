import NextAuth from 'next-auth';

import { authConfig } from '@/app/(auth)/auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - public assets (images, fonts, etc.)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|images|fonts|favicon.ico).*)',
  ],
};
