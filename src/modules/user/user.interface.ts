export enum UserRole {
  MODERATOR = "moderator",
  ADMIN = "admin",
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  dateOfBirth: Date;
  gender: string;
  address: string;
  phone: string;
  role?: UserRole;
  emailVerified?: boolean;
  emailVerificationToken?: string;
  emailVerificationTokenExpires?: Date;
  emailVerifiedAt?: Date;
  needPasswordChange?: boolean;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
