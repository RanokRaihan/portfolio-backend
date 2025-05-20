import { z } from "zod";

export const blogValidation = z.object({
  body: z
    .object({
      title: z.string({ required_error: "Title is required" }),
      summary: z.string({ required_error: "Summary is required" }),
      content: z.string({ required_error: "Content is required" }),
      category: z.string({ required_error: "Category is required" }),
      tags: z.array(z.string(), {
        required_error: "Tags are required",
      }),
      author: z.string().optional(),
      readTime: z.number().optional(),
      isFeatured: z.preprocess(
        (val) =>
          typeof val === "string"
            ? val === "true"
              ? true
              : val === "false"
              ? false
              : val
            : val,
        z.boolean().default(false)
      ),
      status: z.enum(["draft", "published"], {
        required_error: "Status must be either draft or published",
      }),
    })
    .strict(),
});

export const blogUpdateValidation = z.object({
  body: z
    .object({
      title: z.string().optional(),
      summary: z.string().optional(),
      content: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
      author: z.string().optional(),
      readTime: z.number().optional(),
      isFeatured: z.preprocess(
        (val) =>
          typeof val === "string"
            ? val === "true"
              ? true
              : val === "false"
              ? false
              : val
            : val,
        z.boolean().optional()
      ),
      status: z.enum(["draft", "published"]).optional(),
    })
    .strict(),
});
