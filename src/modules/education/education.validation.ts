import { z } from "zod";

export const createEducationSchema = z.object({
  body: z
    .object({
      institution: z
        .string({ required_error: "Institution is required" })
        .min(1, "Institution must be at least 1 character")
        .max(120, "Institution must be at most 120 characters")
        .trim(),
      degree: z.string().min(1).max(100).trim().optional(),
      field: z.string().min(1).max(100).trim().optional(),
      description: z.string().max(1000).optional(),
      logoUrl: z.string().url({ message: "logoUrl must be a valid URL" }).optional(),
      location: z.string().max(100).trim().optional(),
      isCurrent: z.boolean().optional(),
      startDate: z.coerce.date({ required_error: "Start date is required" }),
      endDate: z.coerce.date().optional(),
      featured: z.boolean().optional(),
      sortOrder: z.number().int().min(0).optional(),
    })
    .strict()
    .refine(
      (data) => {
        if (!data.isCurrent && !data.endDate) return true;
        if (data.isCurrent) return true;
        return data.endDate! > data.startDate;
      },
      { message: "End date must be after start date", path: ["endDate"] },
    ),
});

export const updateEducationSchema = z.object({
  body: z
    .object({
      institution: z.string().min(1).max(120).trim().optional(),
      degree: z.string().min(1).max(100).trim().optional(),
      field: z.string().min(1).max(100).trim().optional(),
      description: z.string().max(1000).optional(),
      logoUrl: z.string().url({ message: "logoUrl must be a valid URL" }).optional(),
      location: z.string().max(100).trim().optional(),
      isCurrent: z.boolean().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      featured: z.boolean().optional(),
      sortOrder: z.number().int().min(0).optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided to update",
    })
    .refine(
      (data) => {
        if (data.isCurrent) return true;
        if (data.startDate && data.endDate) return data.endDate > data.startDate;
        return true;
      },
      { message: "End date must be after start date", path: ["endDate"] },
    ),
});
