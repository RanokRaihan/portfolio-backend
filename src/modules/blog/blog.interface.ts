export interface IBlog {
  _id?: string;
  title: string;
  summary: string;
  content: string;
  thumbnail: string;
  category: string;
  tags: string[];
  author?: string;
  readTime?: number;
  isFeatured?: boolean;
  status: "draft" | "published";
  images?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type IBlogFilters = {
  searchTerm?: string;
  category?: string;
  tag?: string;
  status?: string;
  isFeatured?: boolean;
};
