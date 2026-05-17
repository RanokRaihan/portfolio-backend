import { Types } from "mongoose";

export type TBlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface IBlog {
  addedBy: Types.ObjectId;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  status?: TBlogStatus;
  views?: number;
  readTime?: number;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  featured?: boolean;
  publishedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
}
