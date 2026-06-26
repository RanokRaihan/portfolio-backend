import { Types } from "mongoose";

export type TRelation = "MENTOR" | "PEER" | "CLIENT" | "INSTRUCTOR" | "OTHER";

export interface ITestimonial {
  addedBy?: Types.ObjectId;
  name: string;
  email: string;
  role: string;
  company?: string;
  avatar?: string;
  linkedIn?: string;
  quote: string;
  relation: TRelation;
  featured?: boolean;
  sortOrder?: number;
  isPublished?: boolean;
  isDeleted?: boolean;
}
