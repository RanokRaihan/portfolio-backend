import QueryBuilder from "../../builder/queryBuilder";
import { IProject } from "./project.interface";
import Project from "./project.model";

// Create a new project
export const createProjectService = async (
  payload: IProject
): Promise<IProject> => {
  const result = await Project.create(payload);
  return result;
};

// Get all projects with filtering and pagination
export const getAllProjectsService = async (query: Record<string, unknown>) => {
  const searchableFields = ["title", "summary", "description", "technologies"];
  const filterableFields = ["status", "isFeatured"];

  // Handle technology filter separately as it's an array field
  let technologyFilter = {};
  if (query.technology) {
    technologyFilter = {
      technologies: { $in: [query.technology] },
    };
    delete query.technology;
  }

  // Create the main query
  const projectQuery = new QueryBuilder(Project.find(technologyFilter), query)
    .search(searchableFields)
    .filter(filterableFields)
    .sort()
    .paginate();

  const result = await projectQuery.modelQuery;
  const meta = await projectQuery.countTotal();

  return {
    meta,
    data: result,
  };
};

// Get a single project by ID
export const getProjectByIdService = async (
  id: string
): Promise<IProject | null> => {
  const result = await Project.findById(id);
  return result;
};

// Update a project
export const updateProjectService = async (
  id: string,
  payload: Partial<IProject>
): Promise<IProject | null> => {
  const result = await Project.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

// Delete a project
export const deleteProjectService = async (
  id: string
): Promise<IProject | null> => {
  const result = await Project.findByIdAndDelete(id);
  return result;
};

// Get featured projects
export const getFeaturedProjectsService = async (): Promise<IProject[]> => {
  const result = await Project.find({ isFeatured: true }).sort({
    createdAt: -1,
  });
  return result;
};

// Get projects by status
export const getProjectsByStatusService = async (
  status: string
): Promise<IProject[]> => {
  const result = await Project.find({ status }).sort({ createdAt: -1 });
  return result;
};

// Get projects by technology
export const getProjectsByTechnologyService = async (
  technology: string
): Promise<IProject[]> => {
  const result = await Project.find({
    technologies: { $in: [technology] },
  }).sort({ createdAt: -1 });
  return result;
};

// Count projects by status
export const countProjectsByStatusService = async (): Promise<
  Record<string, number>
> => {
  const counts = await Project.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  return counts.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {} as Record<string, number>);
};
