import QueryBuilder from "../../builder/queryBuilder";
import { ISkill } from "./skill.interface";
import Skill from "./skill.model";

// Create a new skill
export const createSkillService = async (payload: ISkill): Promise<ISkill> => {
  const result = await Skill.create(payload);
  return result;
};

// Get all skills with filtering and pagination
export const getAllSkillsService = async (query: Record<string, unknown>) => {
  const searchableFields = ["name", "description", "category"];
  const filterableFields = ["category", "featured", "proficiencyLevel"];

  const skillQuery = new QueryBuilder(Skill.find(), query)
    .search(searchableFields)
    .filter(filterableFields)
    .sort()
    .paginate();

  const result = await skillQuery.modelQuery;
  const meta = await skillQuery.countTotal();

  return {
    meta,
    data: result,
  };
};

// Get a single skill by ID
export const getSkillByIdService = async (
  id: string
): Promise<ISkill | null> => {
  const result = await Skill.findById(id);
  return result;
};

// Update a skill
export const updateSkillService = async (
  id: string,
  payload: Partial<ISkill>
): Promise<ISkill | null> => {
  const result = await Skill.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

// Delete a skill
export const deleteSkillService = async (
  id: string
): Promise<ISkill | null> => {
  const result = await Skill.findByIdAndDelete(id);
  return result;
};

// Get featured skills
export const getFeaturedSkillsService = async (): Promise<ISkill[]> => {
  const result = await Skill.find({ featured: true }).sort({ createdAt: -1 });
  return result;
};

// Get skills by category
export const getSkillsByCategoryService = async (
  category: string
): Promise<ISkill[]> => {
  const result = await Skill.find({ category }).sort({ createdAt: -1 });
  return result;
};
