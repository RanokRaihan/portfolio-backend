import { z } from "zod";

const urlField = z.string().url({ message: "Must be a valid URL" }).optional();
const relationEnum = z.enum(["MENTOR", "PEER", "CLIENT", "INSTRUCTOR", "OTHER"]);

export const createTestimonialSchema = z.object({
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
        .trim(),
      role: z
        .string({ required_error: "Role is required" })
        .min(1, "Role must be at least 1 character")
        .max(150, "Role must be at most 150 characters")
        .trim(),
      company: z.string().min(1).max(150).trim().optional(),
      avatar: urlField,
      linkedIn: urlField,
      quote: z
        .string({ required_error: "Quote is required" })
        .min(10, "Quote must be at least 10 characters")
        .max(1000, "Quote must be at most 1000 characters")
        .trim(),
      relation: relationEnum,
      featured: z.boolean().optional(),
      sortOrder: z.number().int().min(0).optional(),
    })
    .strict(),
});

export const updateTestimonialSchema = z.object({
  body: z
    .object({
      name: z.string().min(1).max(100).trim().optional(),
      email: z.string().email("Must be a valid email address").trim().optional(),
      role: z.string().min(1).max(150).trim().optional(),
      company: z.string().min(1).max(150).trim().optional(),
      avatar: urlField,
      linkedIn: urlField,
      quote: z.string().min(10).max(1000).trim().optional(),
      relation: relationEnum.optional(),
      featured: z.boolean().optional(),
      sortOrder: z.number().int().min(0).optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided to update",
    }),
});
