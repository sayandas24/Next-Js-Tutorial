# Getting Started

This guide outlines the steps to set up your models and schemas.

### 0. Grouping folder with (group) for bunch of route

## 1. Model Setup (`src/model`)

### a. Define the `Message` Interface

- Created an interface named `Message` that extends the `Document` interface from Mongoose.

```typescript
import { Document } from "mongoose";

export interface Message extends Document {
  // Define your message properties here (e.g., content, sender, timestamp)
}
```

## 2. Define Schemas (`src/schemas`)

```typescript
import { z } from "zod";

export const signInSchema = z.object({
  // Schema type and acceptance
  // identifier(previous login)
  identifier: z.string(),
  password: z.string(),
});
```

## 3. Connect to DB (`src/lib/dbConnect.ts`)

```typescript
import mongoose from "mongoose";

// type of the object? that will received here
type ConnectionObject = {
  isConnection?: number;
};
// Only connection is accepted
const connection: ConnectionObject = {};

// Promise<void> <-this means it returns promise (Void type)
async function dbConnect(): Promise<void> {
  if (connection.isConnection) {
    //if database already connected before then return
    console.log("Already connected to DB");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");

    // checking if database connection fully ready?(readyState)
    // pass data true/false to -> connection.isConnection (condition)
    connection.isConnection = db.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB connection failed: ", error);
    process.exit; // exit process if not connected
  }
}

export default dbConnect;
```

## 4. register user step (Setup resend-email with next.js)

- first check if the user is new or registered early but did not verify the email with the verification code

- created signUp and signIn schemas for that in (`src/schemas/`)

- Use resend-email for that to register user,
- if the user registered the user need to verify the email with their given otp code located in (`src/lib/resend.ts`) (`src/helpers/sendVerificationEmail.ts`) (`src/types/ApiResponse.ts`)
- created (`src/types/ApiResponse.ts`) this file for type safety

- (`src/helpers/sendVerificationEmail.ts`) sendVerificationEmail is the function to send verification email to user
- (`emails/VerificationEmail.tsx`) is a React template that shows how the email looks like

## 5. Create routes for api (`src/app/api/---`)

### a. created sign-up route

```yaml
  - connect with db
  - accessing data from frontend, (username, email, password)
  - finding if user is present then send status code
  -- if user is present with email but not verified with the code then do work
  - also when user verifying, hashed the password with bcrypt
  - create user if not present
  - send verification code in the email
```

## 6. NextAuth for authentication (`src/app/api/auth/[...nextauth]`)

```yaml
- create options and route files
- in options we have to specify the providers that we want to use
  -- make authOptions
  -- make provider with username and password field(manually) => https://next-auth.js.org/providers/credentials
  -- find user with given email pas from db
  -- make pages in the authOptions method to overwrite default route
  -- get session from jwt in the authOptions
  -- implement session and jwt callback** in authOptions => https://next-auth.js.org/configuration/callbacks#sign-in-callback
  -- in callback we have session and jwt, in jwt's token -> injecting user data (making powerful)
  -- make a file for defining data types in (`src/types/next-auth.d.ts`)
  --- modifying next-auth to add new field _id
```

### Route file in auth/route.ts

```typescript
//in route files we have to specify the callbacks that we want to use
const handler = NextAuth(authOptions);

// exporting handler as GET and POST
export { handler as GET, handler as POST };
```

## 7. Define Middlewares (`src/middleware.ts`) https://nextjs.org/docs/app/building-your-application/routing/middleware

```yaml
- implement boilerplate code in middleware
- define route where middleware will be applied
- config is kahan kahan pe middleware run kare
```

## 8. Check username unique (`src/app/api/check-username-unique`)

```yaml
- create query schema -> UsernameQuerySchema
  -- check if username is present in db in here -> UsernameQuerySchema
- check username is available or not when user is typing
  -- extracting the ?query from URL
  -- getting the username from query
  -- validate using zod
  -- check in db -> if user present and verified
```

## 9. verify otp code (`src/app/api/verify-code`)

```yaml
- first connect to db
- find the user
- compare the code that is set in the db and the email otp code
- if matched then verify the user
```

## 10. resend verify code again if needed (`src/app/api/reverification-code`)

```yaml
- first connect to db
- find the user
- send verification code in the email
- pass details to -> sendVerificationEmail(email, username, verifyCode)
```
