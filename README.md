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
