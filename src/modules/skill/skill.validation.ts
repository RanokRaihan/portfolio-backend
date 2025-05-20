import { z } from "zod";

export const skillValidationSchema = z.object({
  body: z
    .object({
      name: z.string({ required_error: "Name is required" }),
      description: z.string({ required_error: "Description is required" }),
      category: z.enum(
        [
          "frontend",
          "backend",
          "fullstack",
          "database",
          "devops",
          "tools",
          "other",
        ],
        { required_error: "Category is required" }
      ),
      proficiencyLevel: z
        .enum(["beginner", "intermediate", "advanced", "expert"])
        .default("beginner"),
      yearsOfExperience: z.number().optional(),
      featured: z.boolean().default(false),
    })
    .strict(),
});
