import {z} from "zod";

export const signInSchema = z.object({
    // identifier(previous login)
    identifier: z.string(),
    password: z.string()
})