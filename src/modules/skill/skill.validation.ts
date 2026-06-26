import { z } from "zod";

const SKILL_CATEGORIES = [
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "DEVOPS",
  "LANGUAGE",
  "TOOL",
  "OTHER",
] as const;

const SKILL_LEVELS = ["FAMILIAR", "PROFICIENT", "ADVANCED", "EXPERT"] as const;

export const createSkillSchema = z.object({
  body: z
    .object({
      name: z
        .string({ required_error: "Name is required" })
        .min(1, "Name must be at least 1 character")
        .max(60, "Name must be at most 60 characters")
        .trim(),
      category: z.enum(SKILL_CATEGORIES, {
        required_error: "Category is required",
        message: `Category must be one of: ${SKILL_CATEGORIES.join(", ")}`,
      }),
      level: z.enum(SKILL_LEVELS, {
        required_error: "Level is required",
        message: `Level must be one of: ${SKILL_LEVELS.join(", ")}`,
      }),
      iconUrl: z
        .string()
        .url({ message: "iconUrl must be a valid URL" })
        .optional(),
      iconName: z.string().min(1).max(60).trim().optional(),
      featured: z.boolean().optional(),
      sortOrder: z.number().int().min(0).optional(),
    })
    .strict(),
});

export const updateSkillSchema = z.object({
  body: z
    .object({
      name: z.string().min(1).max(60).trim().optional(),
      category: z
        .enum(SKILL_CATEGORIES, {
          message: `Category must be one of: ${SKILL_CATEGORIES.join(", ")}`,
        })
        .optional(),
      level: z
        .enum(SKILL_LEVELS, {
          message: `Level must be one of: ${SKILL_LEVELS.join(", ")}`,
        })
        .optional(),
      iconUrl: z
        .string()
        .url({ message: "iconUrl must be a valid URL" })
        .optional(),
      iconName: z.string().min(1).max(60).trim().optional(),
      featured: z.boolean().optional(),
      sortOrder: z.number().int().min(0).optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided to update",
    }),
});
