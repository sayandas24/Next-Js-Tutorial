# Getting Started

This guide outlines the steps to set up your models and schemas.

## 1. Model Setup (`src/model`)

### a. Define the `Message` Interface

- Create an interface named `Message` that extends the `Document` interface from Mongoose.

```typescript
import { Document } from 'mongoose';

export interface Message extends Document {
  // Define your message properties here (e.g., content, sender, timestamp)
}
