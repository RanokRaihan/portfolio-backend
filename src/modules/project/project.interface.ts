import { Types } from "mongoose";

export type ProjectCategory =
  | "FULL_STACK"
  | "FRONTEND"
  | "BACKEND"
  | "MOBILE"
  | "CLI_TOOL"
  | "LIBRARY"
  | "API"
  | "PACKAGE"
  | "OTHER";

export type ProjectType =
  | "PERSONAL"
  | "FREELANCE"
  | "OPEN_SOURCE"
  | "CLIENT"
  | "HACKATHON"
  | "OTHER";

export type ProjectStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED"
  | "IN_PROGRESS"
  | "COMING_SOON";

export type ProjectComplexity = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface IProject {
  addedBy: Types.ObjectId;

  title: string;
  slug: string;
  tagline: string;
  summary: string;
  description: string;
  highlights?: string[];
  challenges?: string;
  lessons?: string;

  techStack?: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    devops?: string[];
    other?: string[];
  };

  coverImage?: string;
  thumbnailImage?: string;
  images?: string[];
  videoUrl?: string;
  demoGifUrl?: string;

  tags?: string[];
  category: ProjectCategory;
  type: ProjectType;
  status?: ProjectStatus;
  complexity?: ProjectComplexity;

  frontendLiveUrl?: string;
  frontendRepoUrl?: string;
  backendLiveUrl?: string;
  backendRepoUrl?: string;
  caseStudyUrl?: string;
  npmUrl?: string;
  devToUrl?: string;
  figmaUrl?: string;

  linesOfCode?: number;
  githubStars?: number;
  npmDownloads?: number;
  activeUsers?: number;

  teamSize?: number;
  myRole: string;
  contributors?: string[];

  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;

  featured?: boolean;
  sortOrder?: number;
  isFeaturedOnHome?: boolean;
  isDeleted?: boolean;
  deletedBy?: Types.ObjectId;
  deletedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
}
