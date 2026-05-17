import { z } from "zod";

const socialsSchema = z
  .object({
    github: z.string().url({ message: "github must be a valid URL" }).optional(),
    linkedin: z.string().url({ message: "linkedin must be a valid URL" }).optional(),
    twitter: z.string().url({ message: "twitter must be a valid URL" }).optional(),
    devTo: z.string().url({ message: "devTo must be a valid URL" }).optional(),
    youtube: z.string().url({ message: "youtube must be a valid URL" }).optional(),
    email: z.string().email({ message: "email must be a valid email address" }).optional(),
  })
  .strict();

export const createSettingSchema = z.object({
  body: z
    .object({
      name: z
        .string({ required_error: "Name is required" })
        .min(1, "Name must be at least 1 character")
        .max(100, "Name must be at most 100 characters")
        .trim(),
      title: z.string().max(150).trim().optional(),
      bio: z.string().max(2000).optional(),
      avatar: z.string().url({ message: "avatar must be a valid URL" }).optional(),
      resumeUrl: z.string().url({ message: "resumeUrl must be a valid URL" }).optional(),
      openToWork: z.boolean().optional(),
      availableFrom: z.coerce.date().optional(),
      socials: socialsSchema.optional(),
      metaTitle: z.string().max(100).trim().optional(),
      metaDescription: z.string().max(300).trim().optional(),
      ogImage: z.string().url({ message: "ogImage must be a valid URL" }).optional(),
      footerText: z.string().max(300).trim().optional(),
    })
    .strict(),
});

export const updateSettingSchema = z.object({
  body: z
    .object({
      name: z.string().min(1).max(100).trim().optional(),
      title: z.string().max(150).trim().optional(),
      bio: z.string().max(2000).optional(),
      avatar: z.string().url({ message: "avatar must be a valid URL" }).optional(),
      resumeUrl: z.string().url({ message: "resumeUrl must be a valid URL" }).optional(),
      openToWork: z.boolean().optional(),
      availableFrom: z.coerce.date().optional(),
      socials: socialsSchema.optional(),
      metaTitle: z.string().max(100).trim().optional(),
      metaDescription: z.string().max(300).trim().optional(),
      ogImage: z.string().url({ message: "ogImage must be a valid URL" }).optional(),
      footerText: z.string().max(300).trim().optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided to update",
    }),
});
