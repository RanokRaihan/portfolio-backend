export interface IProjectInsight {
  total: number;
  completed: number;
  inProgress: number;
  planned: number;
}

export interface ISkillInsight {
  total: number;
  featured: number;
  beginner: number;
  intermediate: number;
  advanced: number;
  expert: number;
}

export interface IBlogInsight {
  total: number;
  published: number;
  draft: number;
}

export interface IDashboardInsight {
  project: IProjectInsight;
  skill: ISkillInsight;
  blog: IBlogInsight;
}
