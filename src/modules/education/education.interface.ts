import { Types } from "mongoose";

export interface IEducation {
  addedBy: Types.ObjectId;
  institution: string;
  degree?: string;
  field?: string;
  description?: string;
  logoUrl?: string;
  location?: string;
  isCurrent?: boolean;
  startDate: Date;
  endDate?: Date;
  featured?: boolean;
  sortOrder?: number;
  isDeleted?: boolean;
}
