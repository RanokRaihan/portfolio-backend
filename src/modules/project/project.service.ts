import QueryBuilder from "../../builder/queryBuilder";
import ApiError from "../../errors/ApiError";
import { IMeta } from "../../interface/global.interface";
import { IProject } from "./project.interface";
import Project from "./project.model";

const PUBLIC_PROJECT_FIELDS = "-isDeleted -deletedBy -deletedAt";

const createProjectService = async (
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

const getAllPublicProjectsService = async (
  query: Record<string, unknown>,
): Promise<{ data: unknown[]; meta: IMeta }> => {
  const queryBuilder = new QueryBuilder(
    Project.find({ isDeleted: false, status: "PUBLISHED" }),
    query,
  )
    .search(["title", "tagline", "summary", "tags"])
    .filter(["category", "type", "complexity", "featured", "isFeaturedOnHome"])
    .sort()
    .paginate();

  const data = await queryBuilder.modelQuery.select(PUBLIC_PROJECT_FIELDS);
  const meta = await queryBuilder.countTotal();
  return { data, meta };
};

const getPublicProjectBySlugService = async (slug: string) => {
  const project = await Project.findOne({
    slug,
    isDeleted: false,
    status: "PUBLISHED",
  }).select(PUBLIC_PROJECT_FIELDS);

  if (!project) {
    throw new ApiError(404, "Project not found", "getPublicProjectBySlug");
  }
  return project;
};

const getPublicProjectByIdService = async (id: string) => {
  const project = await Project.findOne({
    _id: id,
    isDeleted: false,
    status: "PUBLISHED",
  }).select(PUBLIC_PROJECT_FIELDS);

  if (!project) {
    throw new ApiError(404, "Project not found", "getPublicProjectById");
  }
  return project;
};

const getAllManagedProjectsService = async (
  query: Record<string, unknown>,
): Promise<{ data: unknown[]; meta: IMeta }> => {
  const queryBuilder = new QueryBuilder(
    Project.find({ isDeleted: false }),
    query,
  )
    .search(["title", "tagline", "summary", "tags"])
    .filter(["category", "type", "complexity", "status", "featured", "isFeaturedOnHome"])
    .sort()
    .paginate();

  const data = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();
  return { data, meta };
};

const getManagedProjectByIdService = async (id: string) => {
  const project = await Project.findOne({ _id: id, isDeleted: false });
  if (!project) {
    throw new ApiError(404, "Project not found", "getManagedProjectById");
  }
  return project;
};

const updateProjectService = async (
  id: string,
  data: Partial<Omit<IProject, "addedBy" | "isDeleted" | "deletedBy" | "deletedAt">>,
) => {
  if (data.slug) {
    const conflict = await Project.findOne({
      slug: data.slug,
      _id: { $ne: id },
      isDeleted: false,
    });
    if (conflict) {
      throw new ApiError(409, "A project with this slug already exists", "updateProject");
    }
  }

  const project = await Project.findOneAndUpdate(
    { _id: id, isDeleted: false },
    data,
    { new: true, runValidators: true },
  );

  if (!project) {
    throw new ApiError(404, "Project not found", "updateProject");
  }
  return project;
};

const changeProjectStatusService = async (
  id: string,
  status: IProject["status"],
) => {
  const project = await Project.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { status },
    { new: true, runValidators: true },
  );

  if (!project) {
    throw new ApiError(404, "Project not found", "changeProjectStatus");
  }
  return project;
};

const softDeleteProjectService = async (id: string, deletedBy: string) => {
  const project = await Project.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, deletedBy, deletedAt: new Date() },
    { new: true },
  );

  if (!project) {
    throw new ApiError(404, "Project not found", "softDeleteProject");
  }
  return { _id: project._id, title: project.title, deletedAt: project.deletedAt };
};

export {
  changeProjectStatusService,
  createProjectService,
  getAllManagedProjectsService,
  getAllPublicProjectsService,
  getManagedProjectByIdService,
  getPublicProjectByIdService,
  getPublicProjectBySlugService,
  softDeleteProjectService,
  updateProjectService,
};
