export interface IProject {
  _id?: string;
  title: string;
  summary: string;
  description: string;
  challenges: string[];
  technologies: string[];
  backendRepo?: string;
  frontendRepo?: string;
  backendLive?: string;
  frontendLive?: string;
  thumbnail: string;
  images: string[];
  isFeatured: boolean;
  keyFeatures: string[];
  status: "completed" | "in-progress" | "planned";
  createdAt?: Date;
  updatedAt?: Date;
}

export type IProjectFilters = {
  searchTerm?: string;
  technology?: string;
  status?: string;
  isFeatured?: boolean;
};
