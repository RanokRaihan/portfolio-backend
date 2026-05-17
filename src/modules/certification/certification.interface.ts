import { Types } from "mongoose";

export interface ICertification {
  addedBy: Types.ObjectId;
  name: string;
  issuer: string;
  issuerLogoUrl?: string;
  credentialId?: string;
  credentialUrl?: string;
  certificateUrl?: string;
  badgeUrl?: string;
  isExpired?: boolean;
  isLifetime?: boolean;
  courseStartDate?: Date;
  courseEndDate?: Date;
  issuedAt: Date;
  expiresAt?: Date;
  featured?: boolean;
  sortOrder?: number;
  isDeleted?: boolean;
  deletedAt?: Date;
}
