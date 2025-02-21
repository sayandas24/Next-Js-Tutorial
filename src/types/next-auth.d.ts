import "next-auth";
import { DefaultSession } from "next-auth";

// modifying next-auth package
declare module "next-auth" {
  interface User {
    // injecting some field to user located in /src/auth/options
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  }

  // add fields in session now
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
      username?: string;
    } & DefaultSession['user'] // default session par user ayegi hi ayegi
  }
}

declare module "next-auth/jwt" {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string;
    }
}