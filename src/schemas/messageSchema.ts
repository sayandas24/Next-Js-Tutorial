import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Must must contain at least 1 character" })
    .max(300, { message: "content must be less than 300 characters" }),
});
