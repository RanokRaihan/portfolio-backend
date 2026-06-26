import { z } from "zod";

const urlField = z.string().url({ message: "Must be a valid URL" }).optional();

const slugField = z
  .string()
  .toLowerCase()
  .min(1)
  .max(200)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase alphanumeric characters separated by hyphens",
  )
  .optional();

const tagsField = z
  .array(z.string().min(1).max(50).trim())
  .max(10, "A maximum of 10 tags are allowed")
  .optional();

const statusField = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const createBlogSchema = z.object({
  body: z
    .object({
      title: z
        .string({ required_error: "Title is required" })
        .min(1, "Title must be at least 1 character")
        .max(300, "Title must be at most 300 characters")
        .trim(),
      slug: slugField,
      summary: z
        .string({ required_error: "Summary is required" })
        .min(10, "Summary must be at least 10 characters")
        .max(500, "Summary must be at most 500 characters")
        .trim(),
      content: z
        .string({ required_error: "Content is required" })
        .min(10, "Content must be at least 10 characters")
        .trim(),
      coverImage: urlField,
      tags: tagsField,
      status: statusField.optional(),
      metaTitle: z.string().min(1).max(150).trim().optional(),
      metaDescription: z.string().min(1).max(300).trim().optional(),
      ogImage: urlField,
      featured: z.boolean().optional(),
    })
    .strict(),
});

export const updateBlogSchema = z.object({
  body: z
    .object({
      title: z.string().min(1).max(300).trim().optional(),
      slug: slugField,
      summary: z.string().min(10).max(500).trim().optional(),
      content: z.string().min(10).trim().optional(),
      coverImage: urlField,
      tags: tagsField,
      status: statusField.optional(),
      metaTitle: z.string().min(1).max(150).trim().optional(),
      metaDescription: z.string().min(1).max(300).trim().optional(),
      ogImage: urlField,
      featured: z.boolean().optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided to update",
    }),
});
