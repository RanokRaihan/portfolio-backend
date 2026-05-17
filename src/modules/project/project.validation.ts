import { z } from "zod";

const urlSchema = z.string().url({ message: "Must be a valid URL" }).optional();

export const createProjectSchema = z.object({
  body: z
    .object({
      title: z
        .string({ required_error: "Title is required" })
        .min(3, "Title must be at least 3 characters")
        .max(120, "Title must be at most 120 characters")
        .trim(),
      slug: z
        .string()
        .min(3, "Slug must be at least 3 characters")
        .max(120)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case")
        .optional(),
      tagline: z
        .string({ required_error: "Tagline is required" })
        .min(10, "Tagline must be at least 10 characters")
        .max(200, "Tagline must be at most 200 characters")
        .trim(),
      summary: z
        .string({ required_error: "Summary is required" })
        .min(20, "Summary must be at least 20 characters")
        .max(500, "Summary must be at most 500 characters"),
      description: z
        .string({ required_error: "Description is required" })
        .min(50, "Description must be at least 50 characters"),
      highlights: z.array(z.string().min(1)).max(10).optional(),
      challenges: z.string().max(1000).optional(),
      lessons: z.string().max(1000).optional(),

      techStack: z
        .object({
          frontend: z.array(z.string().min(1)).optional(),
          backend: z.array(z.string().min(1)).optional(),
          database: z.array(z.string().min(1)).optional(),
          devops: z.array(z.string().min(1)).optional(),
          other: z.array(z.string().min(1)).optional(),
        })
        .optional(),

      coverImage: urlSchema,
      thumbnailImage: urlSchema,
      images: z.array(z.string().url()).max(10).optional(),
      videoUrl: urlSchema,
      demoGifUrl: urlSchema,

      tags: z.array(z.string().min(1).max(30)).max(20).optional(),
      category: z.enum([
        "FULL_STACK",
        "FRONTEND",
        "BACKEND",
        "MOBILE",
        "CLI_TOOL",
        "LIBRARY",
        "API",
        "PACKAGE",
        "OTHER",
      ]),
      type: z.enum([
        "PERSONAL",
        "FREELANCE",
        "OPEN_SOURCE",
        "CLIENT",
        "HACKATHON",
        "OTHER",
      ]),
      status: z
        .enum(["DRAFT", "PUBLISHED", "ARCHIVED", "IN_PROGRESS", "COMING_SOON"])
        .optional(),
      complexity: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),

      frontendLiveUrl: urlSchema,
      frontendRepoUrl: urlSchema,
      backendLiveUrl: urlSchema,
      backendRepoUrl: urlSchema,
      caseStudyUrl: urlSchema,
      npmUrl: urlSchema,
      devToUrl: urlSchema,
      figmaUrl: urlSchema,

      linesOfCode: z.number().int().nonnegative().optional(),
      githubStars: z.number().int().nonnegative().optional(),
      npmDownloads: z.number().int().nonnegative().optional(),
      activeUsers: z.number().int().nonnegative().optional(),

      teamSize: z.number().int().min(1).max(100).optional(),
      myRole: z
        .string({ required_error: "Your role is required" })
        .min(2, "Role must be at least 2 characters")
        .max(100),
      contributors: z.array(z.string().min(1)).optional(),

      metaTitle: z.string().max(70).optional(),
      metaDescription: z.string().max(160).optional(),
      ogImage: urlSchema,

      featured: z.boolean().optional(),
      sortOrder: z.number().int().min(0).optional(),
      isFeaturedOnHome: z.boolean().optional(),

      startedAt: z.coerce.date().optional(),
      completedAt: z.coerce.date().optional(),
    })
    .strict(),
});
