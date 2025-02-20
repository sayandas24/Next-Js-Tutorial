import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import CredentialsProvider from "next-auth/providers/credentials";

// auth options (type : NextAuthOptions)
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

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
  ],
};
