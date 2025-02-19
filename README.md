# Getting Started

This guide outlines the steps to set up your models and schemas.

## 1. Model Setup (`src/model`)

### a. Define the `Message` Interface

- Create an interface named `Message` that extends the `Document` interface from Mongoose.

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
- if the user registered the user need to verify the email with their given otp code located in (`src/lib/resend.ts`)(`src/helpers/sendVerificationEmail.ts`) (`src/types/ApiResponse.ts`)
- created (`src/types/ApiResponse.ts`) this file for type safety

- (`src/helpers/sendVerificationEmail.ts`) sendVerificationEmail is the function to send verification email to user
- (`emails/VerificationEmail.tsx`) is a React template that shows how the email looks like

## 4. Create routes for api (`src/app/api/---`)
### a. created sign-up route
```yaml
  - connect with db
  - accessing data from frontend, (username, email, password)
  - finding if user is present then send status code
  -- if user is present with email but not verified with the code then do work
  - also when user verifying hashed the password with bcrypt
  - create user if not present
  - send verification code in the email 
```