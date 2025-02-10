// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";
import GoogleProvider from "next-auth/providers/google"; 

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      authorization: {
        params: { scope: "r_liteprofile r_emailaddress" },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID, // Add Google Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Add Google Client Secret
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 180, // ⏳ Set session expiration to 180 seconds (3 minutes)
    updateAge: 60, // 🔄 Extend session only if the user is active every 60 seconds
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
};

export default NextAuth(authOptions);