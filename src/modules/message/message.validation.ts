import { z } from "zod";

export const submitMessageSchema = z.object({
  body: z
    .object({
      name: z
        .string({ required_error: "Name is required" })
        .min(1, "Name must be at least 1 character")
        .max(100, "Name must be at most 100 characters")
        .trim(),
      email: z
        .string({ required_error: "Email is required" })
        .email("Must be a valid email address")
        .toLowerCase()
        .trim(),
      subject: z.string().min(1).max(200).trim().optional(),
      message: z
        .string({ required_error: "Message is required" })
        .min(10, "Message must be at least 10 characters")
        .max(2000, "Message must be at most 2000 characters")
        .trim(),
    })
    .strict(),
});

export const updateMessageStatusSchema = z.object({
  body: z
    .object({
      status: z.enum(["UNREAD", "READ", "REPLIED", "ARCHIVED"], {
        required_error: "Status is required",
        message: "Status must be one of: UNREAD, READ, REPLIED, ARCHIVED",
      }),
    })
    .strict(),
});
