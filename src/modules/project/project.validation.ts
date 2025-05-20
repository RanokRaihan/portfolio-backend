import { z } from "zod";

export const projectValidation = z.object({
  body: z
    .object({
      title: z.string({ required_error: "Title is required" }),
      summary: z.string({ required_error: "Summary is required" }),
      description: z.string({ required_error: "Description is required" }),
      challenges: z.array(z.string(), {
        required_error: "Challenges is required",
      }),
      technologies: z.array(z.string(), {
        required_error: "Technologies are required",
      }),
      backendRepo: z.string().optional(),
      frontendRepo: z.string().optional(),
      backendLive: z.string().optional(),
      frontendLive: z.string().optional(),
      images: z.array(z.string()).optional(),
      isFeatured: z.preprocess(
        (val) =>
          typeof val === "string"
            ? val === "true"
              ? true
              : val === "false"
              ? false
              : val
            : val,
        z.boolean({ required_error: "isFeatured is required" })
      ),
      keyFeatures: z.array(z.string(), {
        required_error: "Key features are required",
      }),
      status: z.enum(["completed", "in-progress", "planned"], {
        required_error: "Status is required",
      }),
    })
    .strict(),
});
