import ApiError from "../../errors/ApiError";
import { ISkill, SkillCategory } from "./skill.interface";
import Skill from "./skill.model";

const generateSlug = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/--+/g, "-");

const createSkillService = async (data: Omit<ISkill, "slug">) => {
  const slug = generateSlug(data.name);

  const existing = await Skill.findOne({ $or: [{ name: data.name }, { slug }] });
  if (existing) {
    throw new ApiError(409, "A skill with this name already exists", "createSkill");
  }

  const skill = await Skill.create({ ...data, slug });
  return skill;
};

const getAllPublicSkillsService = async (category?: string) => {
  const filter: Record<string, unknown> = {};

  if (category) {
    filter.category = category.toUpperCase();
  }

  const skills = await Skill.find(filter)
    .sort({ sortOrder: 1, name: 1 })
    .select("-addedBy");

  return skills;
};

const getSkillByIdService = async (id: string) => {
  const skill = await Skill.findById(id).select("-addedBy");
  if (!skill) {
    throw new ApiError(404, "Skill not found", "getSkillById");
  }
  return skill;
};

const updateSkillService = async (
  id: string,
  data: Partial<Omit<ISkill, "addedBy">>,
) => {
  const updatePayload: Record<string, unknown> = { ...data };

  if (data.name) {
    const newSlug = generateSlug(data.name);

    const conflict = await Skill.findOne({
      $or: [{ name: data.name }, { slug: newSlug }],
      _id: { $ne: id },
    });
    if (conflict) {
      throw new ApiError(409, "A skill with this name already exists", "updateSkill");
    }

    updatePayload.slug = newSlug;
  }

  const skill = await Skill.findByIdAndUpdate(id, updatePayload, {
    new: true,
    runValidators: true,
  });

  if (!skill) {
    throw new ApiError(404, "Skill not found", "updateSkill");
  }
  return skill;
};

const deleteSkillService = async (id: string) => {
  const skill = await Skill.findByIdAndDelete(id);
  if (!skill) {
    throw new ApiError(404, "Skill not found", "deleteSkill");
  }
  return { _id: skill._id, name: skill.name };
};

export {
  createSkillService,
  deleteSkillService,
  getAllPublicSkillsService,
  getSkillByIdService,
  updateSkillService,
};
