import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://logeeka-magang.mokumuka.com';
          
          const res = await axios.post(`${baseUrl}/api/auth/login`, {
            params: {
              email: credentials?.username, 
              password: credentials?.password
            }
          });

          const token = res.data?.data?.token;

          if (token) {
            return {
              id: "1",
              name: "Admin",
              token: token 
            };
          }
          
          return null;
        } catch (error) {
          console.error("Login gagal:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.accessToken = (user as any).token;
      }
      return token;
    },
    async session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (session as any).accessToken = token.accessToken;
      return session;
    }
  },
  pages: {
    signIn: '/login', 
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "logeeka-rahasia-super-aman-123",
});

export { handler as GET, handler as POST };