import { z } from "zod";

const isAtLeast13 = (val: string) => {
  const dob = new Date(val);
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 13);
  return dob <= cutoff;
};

const dateOfBirthField = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format for dateOfBirth",
  })
  .refine(isAtLeast13, {
    message: "User must be at least 13 years old",
  });

export const createUserSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(1, { message: "Name is required" })
        .max(100, { message: "Name must be at most 100 characters!" }),
      email: z.string().regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
        message: "Invalid email address",
      }),
      dateOfBirth: dateOfBirthField,
      gender: z.enum(["male", "female", "other"], {
        message: "Gender must be one of: male, female, other",
      }),
      address: z
        .string()
        .min(1, { message: "Address is required" })
        .max(300, { message: "Address must be at most 300 characters!" }),
      phone: z
        .string()
        .min(1, { message: "Phone is required" })
        .max(20, { message: "Phone must be at most 20 characters!" }),
    })
    .strict(),
});

export const seedSuperAdminSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(1, { message: "Name is required" })
        .max(100, { message: "Name must be at most 100 characters!" }),
      email: z.string().regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
        message: "Invalid email address",
      }),
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters!" })
        .max(20, { message: "Password must be at most 20 characters!" }),
      dateOfBirth: dateOfBirthField,
      gender: z.enum(["male", "female", "other"], {
        message: "Gender must be one of: male, female, other",
      }),
      address: z
        .string()
        .min(1, { message: "Address is required" })
        .max(300, { message: "Address must be at most 300 characters!" }),
      phone: z
        .string()
        .min(1, { message: "Phone is required" })
        .max(20, { message: "Phone must be at most 20 characters!" }),
    })
    .strict(),
});

export const updateUserStatusSchema = z.object({
  body: z
    .object({
      isActive: z.boolean({ message: "isActive must be a boolean" }),
    })
    .strict(),
});

export const updateUserRoleSchema = z.object({
  body: z
    .object({
      role: z.enum(["admin", "moderator"], {
        message: "Role must be one of: admin, moderator",
      }),
    })
    .strict(),
});

export const updateAvatarSchema = z.object({
  body: z.object({
    image: z.string().url({ message: "image must be a valid URL" }),
  }).strict(),
});

export const updateUserSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(1, { message: "Name cannot be empty" })
        .max(100, { message: "Name must be at most 100 characters!" })
        .optional(),
      dateOfBirth: dateOfBirthField.optional(),
      gender: z
        .enum(["male", "female", "other"], {
          message: "Gender must be one of: male, female, other",
        })
        .optional(),
      address: z
        .string()
        .min(1, { message: "Address cannot be empty" })
        .max(300, { message: "Address must be at most 300 characters!" })
        .optional(),
      phone: z
        .string()
        .min(1, { message: "Phone cannot be empty" })
        .max(20, { message: "Phone must be at most 20 characters!" })
        .optional(),
    })
    .strict(),
});
