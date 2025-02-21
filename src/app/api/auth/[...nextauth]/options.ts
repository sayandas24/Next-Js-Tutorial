import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import CredentialsProvider from "next-auth/providers/credentials"; 

// auth options (type : NextAuthOptions)
export const authOptions: NextAuthOptions = {
  providers: [
    // email password login (provider)
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      // provide credentials for login
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      // return value is a promise and type is <any>
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          // find user with email or username
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier.email },
              { username: credentials.identifier.username },
            ],
          });
          if (!user) {
            throw new Error("No user found with this email or username");
          }

          // if user not verified with otp
          if (!user.isVerified) {
            throw new Error("Verify your account first before login");
          }

          // if user found compare password with bcrypt and user.password
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Password did not matched");
          }
        } catch (err: any) {
          throw new Error("Failed to login", err);
        }
      },
    }),
    // any other provider
    // Github
  ],
  // session and jwt callback
  callbacks: {
    // the user is in the jwt and -> return from providers/CredentialsProvider/authorize
    async jwt({ token, user }) {
      // making the token powerful
      // injecting user properties in token

      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }

      return token;
    },
    // injecting token fields in session
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      return session;
    },
  },

  // overwrite signin default route: (/auth/signin) to /sign-in
  pages: {
    signIn: "/sign-in",
  },
  // session can be access from db(stored token) ot jwt
  session: {
    strategy: "jwt",
  },
  // secret key is important
  // this can be any key
  secret: process.env.NEXTAUTH_SECRET,
};
