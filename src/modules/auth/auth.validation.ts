import { z } from "zod";

export const loginValidationSchema = z.object({
  body: z
    .object({
      email: z.string().email(),
      password: z
        .string()
        .min(6, { message: "password must be at least 6 character!" })
        .max(20, { message: "password must be at most 20 character!" }),
    })
    .strict(),
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      email: z
        .string({ message: "Email is required!" })
        .email({ message: "Invalid email format!" }),
      oldPassword: z.string({ message: "Old password is required!" }),
      newPassword: z.string({ message: "New password is required!" }),
    })
    .strict(),
});

export const sendVerificationEmailSchema = z.object({
  body: z
    .object({
      email: z
        .string({ message: "Email is required!" })
        .email({ message: "Invalid email format!" }),
    })
    .strict(),
});

export const verifyEmailSchema = z.object({
  body: z
    .object({
      token: z.string().min(1, { message: "Token is required" }),
    })
    .strict(),
});
