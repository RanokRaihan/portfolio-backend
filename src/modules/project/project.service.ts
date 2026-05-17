import ApiError from "../../errors/ApiError";
import { IProject } from "./project.interface";
import Project from "./project.model";

export const createProjectService = async (
  data: Omit<IProject, "isDeleted" | "deletedBy" | "deletedAt">,
) => {
  const existing = await Project.findOne({
    slug: data.slug,
    isDeleted: false,
  });
  if (existing) {
    throw new ApiError(409, "A project with this slug already exists", "createProject");
  }

  const project = await Project.create(data);
  return project;
};
