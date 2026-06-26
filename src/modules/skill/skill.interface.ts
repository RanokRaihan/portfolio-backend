import { Types } from "mongoose";

export type SkillCategory =
  | "FRONTEND"
  | "BACKEND"
  | "DATABASE"
  | "DEVOPS"
  | "LANGUAGE"
  | "TOOL"
  | "OTHER";

export type SkillLevel = "FAMILIAR" | "PROFICIENT" | "ADVANCED" | "EXPERT";

export interface ISkill {
  addedBy: Types.ObjectId;
  name: string;
  slug: string;
  category: SkillCategory;
  level: SkillLevel;
  iconUrl?: string;
  iconName?: string;
  featured?: boolean;
  sortOrder?: number;
}
