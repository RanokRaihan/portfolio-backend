import { z } from "zod";

const urlField = z.string().url({ message: "Must be a valid URL" }).optional();

export const createCertificationSchema = z.object({
  body: z
    .object({
      name: z
        .string({ required_error: "Certification name is required" })
        .min(1, "Name must be at least 1 character")
        .max(200, "Name must be at most 200 characters")
        .trim(),
      issuer: z
        .string({ required_error: "Issuer is required" })
        .min(1, "Issuer must be at least 1 character")
        .max(150, "Issuer must be at most 150 characters")
        .trim(),
      issuedAt: z.coerce.date({ required_error: "Issued date is required" }),
      issuerLogoUrl: urlField,
      credentialId: z.string().max(200).trim().optional(),
      credentialUrl: urlField,
      certificateUrl: urlField,
      badgeUrl: urlField,
      isExpired: z.boolean().optional(),
      isLifetime: z.boolean().optional(),
      courseStartDate: z.coerce.date().optional(),
      courseEndDate: z.coerce.date().optional(),
      expiresAt: z.coerce.date().optional(),
      featured: z.boolean().optional(),
      sortOrder: z.number().int().min(0).optional(),
    })
    .strict()
    .refine(
      (data) => {
        if (data.isLifetime === false && !data.expiresAt) return false;
        return true;
      },
      { message: "expiresAt is required when isLifetime is false", path: ["expiresAt"] },
    )
    .refine(
      (data) => {
        if (data.isLifetime && data.expiresAt) return false;
        return true;
      },
      { message: "Cannot set expiresAt when isLifetime is true", path: ["expiresAt"] },
    )
    .refine(
      (data) => {
        if (data.expiresAt && data.expiresAt <= data.issuedAt) return false;
        return true;
      },
      { message: "expiresAt must be after issuedAt", path: ["expiresAt"] },
    )
    .refine(
      (data) => {
        if (data.courseStartDate && data.courseEndDate)
          return data.courseEndDate >= data.courseStartDate;
        return true;
      },
      { message: "courseEndDate must be on or after courseStartDate", path: ["courseEndDate"] },
    ),
});

export const updateCertificationSchema = z.object({
  body: z
    .object({
      name: z.string().min(1).max(200).trim().optional(),
      issuer: z.string().min(1).max(150).trim().optional(),
      issuedAt: z.coerce.date().optional(),
      issuerLogoUrl: urlField,
      credentialId: z.string().max(200).trim().optional(),
      credentialUrl: urlField,
      certificateUrl: urlField,
      badgeUrl: urlField,
      isExpired: z.boolean().optional(),
      isLifetime: z.boolean().optional(),
      courseStartDate: z.coerce.date().optional(),
      courseEndDate: z.coerce.date().optional(),
      expiresAt: z.coerce.date().optional(),
      featured: z.boolean().optional(),
      sortOrder: z.number().int().min(0).optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided to update",
    })
    .refine(
      (data) => {
        if (data.isLifetime && data.expiresAt) return false;
        return true;
      },
      { message: "Cannot set expiresAt when isLifetime is true", path: ["expiresAt"] },
    )
    .refine(
      (data) => {
        if (data.courseStartDate && data.courseEndDate)
          return data.courseEndDate >= data.courseStartDate;
        return true;
      },
      { message: "courseEndDate must be on or after courseStartDate", path: ["courseEndDate"] },
    ),
});
