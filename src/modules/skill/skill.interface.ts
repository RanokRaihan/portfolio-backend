export interface ISkill {
  _id?: string;
  name: string;
  description: string;
  category:
    | "frontend"
    | "backend"
    | "fullstack"
    | "database"
    | "devops"
    | "tools"
    | "other";
  image: string;
  proficiencyLevel?: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience?: number;
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
