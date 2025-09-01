
import NextAuth, { type User, type Session } from 'next-auth';
import Google from 'next-auth/providers/google';

import { getUser, createUser } from '@/lib/db/queries';

import { authConfig } from './auth.config';

interface ExtendedSession extends Session {
  user: User;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && user.email) {
        try {
          // Check if user exists in our database
          const existingUsers = await getUser(user.email);
          
          if (existingUsers.length === 0) {
            // Auto-create user if they don't exist
            console.log(`🆕 [GOOGLE_AUTH] Creating new user for email: ${user.email}`);
            const newUser = await createUser({
              email: user.email,
              name: user.name || null,
            });
            console.log(`✅ [GOOGLE_AUTH] User created successfully:`, newUser);
          } else {
            console.log(`✅ [GOOGLE_AUTH] Existing user found for email: ${user.email}`);
          }
          
          return true;
        } catch (error) {
          console.error('❌ [GOOGLE_AUTH] Error during sign-in:', error);
          return false;
        }
      }
      
      return true;
    },
    async jwt({ token, user }) {
      if (user && user.email) {
        // Get the user from our database to get the correct ID
        const dbUsers = await getUser(user.email);
        if (dbUsers.length > 0) {
          token.id = dbUsers[0].id;
          token.email = dbUsers[0].email;
          token.name = dbUsers[0].name;
        }
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: any;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }

      return session;
    },
  },
});
