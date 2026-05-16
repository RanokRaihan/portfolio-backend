import { z } from "zod";

export const createUserSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(1, { message: "Name is required" })
        .max(100, { message: "Name must be at most 100 characters!" }),
      email: z.string().regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
        message: "Invalid email address",
      }),
      dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format for dateOfBirth",
      }),
      gender: z.enum(["male", "female", "other"], {
        message: "Gender must be one of: male, female, other",
      }),
      address: z
        .string()
        .min(1, { message: "Address is required" })
        .max(300, { message: "Address must be at most 300 characters!" }),
      phone: z
        .string()
        .min(1, { message: "Phone is required" })
        .max(20, { message: "Phone must be at most 20 characters!" }),
    })
    .strict(),
});
