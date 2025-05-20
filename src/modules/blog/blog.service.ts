import QueryBuilder from "../../builder/queryBuilder";
import { IBlog } from "./blog.interface";
import Blog from "./blog.model";

// Create a new blog
export const createBlogService = async (payload: IBlog): Promise<IBlog> => {
  const result = await Blog.create(payload);
  return result;
};

// Get all blogs with filtering and pagination
export const getAllBlogsService = async (query: Record<string, unknown>) => {
  const searchableFields = ["title", "summary", "content", "category", "tags"];
  const filterableFields = ["status", "isFeatured", "category"];

  // Handle tag filter separately as it's an array field
  let tagFilter = {};
  if (query.tag) {
    tagFilter = {
      tags: { $in: [query.tag] },
    };
    delete query.tag;
  }

  // Create the main query
  const blogQuery = new QueryBuilder(Blog.find(tagFilter), query)
    .search(searchableFields)
    .filter(filterableFields)
    .sort()
    .paginate();

  const result = await blogQuery.modelQuery;
  const meta = await blogQuery.countTotal();

  return {
    meta,
    data: result,
  };
};

// Get a single blog by ID
export const getBlogByIdService = async (id: string): Promise<IBlog | null> => {
  const result = await Blog.findById(id);
  return result;
};

// Update a blog
export const updateBlogService = async (
  id: string,
  payload: Partial<IBlog>
): Promise<IBlog | null> => {
  const result = await Blog.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

// Delete a blog
export const deleteBlogService = async (id: string): Promise<IBlog | null> => {
  const result = await Blog.findByIdAndDelete(id);
  return result;
};

// Get featured blogs
export const getFeaturedBlogsService = async (): Promise<IBlog[]> => {
  const result = await Blog.find({
    isFeatured: true,
    status: "published",
  }).sort({ createdAt: -1 });
  return result;
};

// Get blogs by category
export const getBlogsByCategoryService = async (
  category: string
): Promise<IBlog[]> => {
  const result = await Blog.find({ category, status: "published" }).sort({
    createdAt: -1,
  });
  return result;
};

// Get blogs by tag
export const getBlogsByTagService = async (tag: string): Promise<IBlog[]> => {
  const result = await Blog.find({
    tags: { $in: [tag] },
    status: "published",
  }).sort({ createdAt: -1 });
  return result;
};
