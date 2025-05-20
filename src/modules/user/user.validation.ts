import { z } from "zod";

export const createUserSchema = z.object({
  body: z
    .object({
      email: z.string().regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
        message: "Invalid email address",
      }),
      password: z
        .string()
        .min(6, { message: "password must be at least 6 characters!" })
        .max(20, { message: "password must be at most 20 characters!" }),
      name: z
        .string()
        .min(1, { message: "Name is required" })
        .max(100, { message: "Name must be at most 100 characters!" }),
    })
    .strict(),
});
