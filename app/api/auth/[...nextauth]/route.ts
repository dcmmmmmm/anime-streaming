// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions, DefaultSession, DefaultUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma"; // see below for prisma client setup
import { compare } from "bcryptjs";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: 'USER' | 'ADMIN';
      emailVerified: Date | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: 'USER' | 'ADMIN';
    emailVerified: Date | null;
  }

  interface JWT extends DefaultJWT {
    id: string;
    role: 'USER' | 'ADMIN';
    emailVerified: Date | null;
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Credentials provider for email/password
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        try {
          console.log("Authorize function recieved credentials:", credentials);
          // Check if user credentials are they are Not empty
          if (!credentials?.email || !credentials?.password) {
            throw { error: "No Inputs Found", status: 401 };
          }
          console.log("Passed Check 1 ");
          //Check if user exists
          // Find user in database by email
          const existingUser = await prisma.user.findUnique({
            where: { email: credentials.email ?? "" },
          });
          if (!existingUser) {
            console.log("No user found or invalid login method");
            throw { error: "No user found or invalid login method", status: 401 };
          }
          console.log("Passed Check 2");
          // Validate password (assuming it’s hashed with bcrypt)
          if (!existingUser.password) {
            throw { error: "Password not found", status: 401 };
          }
          const isValid = await compare(credentials.password, existingUser.password);
          if (!isValid) {
            console.log("Invalid Password");
            throw { error: "Invalid Password", status: 401 };
          }
          console.log("Pass 3 Checked");
          const user = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            imageUrl: existingUser.imageUrl,
            emailVerified: existingUser.emailVerified,
          };
          //
          console.log("User Compiled");
          console.log(user);
          return user;
        } catch (error) {
          console.log("ALL Failed");
          console.log(error);
          throw { error: "Something went wrong", status: 401 };
        }
      },
    }),
    // Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    // Add other providers as needed…
  ],
  session: {
    strategy: "jwt",
    // “Remember Me” can be implemented by extending the session maxAge.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  pages: {
    signIn: "/login", // custom sign in page
    signOut: "/logout", // custom sign out page
    error: "/login",
    verifyRequest: "/verify-email",
    // You can also set custom pages for error, verify request, etc.
  },
  callbacks: {
    
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role ;
        token.image = user.image;
        token.emailVerified = user.emailVerified;
      }
      console.log(`token:${token}`);
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as 'USER' | 'ADMIN';
        session.user.image = token.image as string;
        session.user.emailVerified = token.emailVerified as Date;
        
      }
      console.log(`session:${session.user}`);
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
