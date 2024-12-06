import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from '@/lib/axios/axiosInstance';

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }
        try {
          const response = await axios.post('/api/Auth/Login', {
            username: credentials?.username,
            password: credentials?.password,
          });
          const user = response.data;

          if (!user.jwtToken) {
            throw new Error('No token returned from server');
          }

          return { token: user.jwtToken };
        } catch (error) {
          throw new Error(error.response?.data || 'Invalid credentials');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export const POST = handler;
export const GET = handler;
