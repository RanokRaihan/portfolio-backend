import QueryBuilder from "../../builder/queryBuilder";
import ApiError from "../../errors/ApiError";
import { IBlog } from "./blog.interface";
import Blog from "./blog.model";

export const createBlogService = async (data: IBlog) => {
  // pre-save hooks handle: slug auto-gen, readTime calc, publishedAt on first publish
  const blog = await Blog.create(data);
  return blog;
};

export const getAllPublishedBlogsService = async (
  query: Record<string, unknown>,
) => {
  // Base filter locks to PUBLISHED only — query params cannot override this
  const blogQuery = new QueryBuilder(
    Blog.find({ status: "PUBLISHED", isDeleted: false }),
    query,
  )
    .search(["title", "summary", "tags"])
    .sort()
    .paginate();

  const data = await blogQuery.modelQuery.select(
    "-addedBy -isDeleted -deletedAt",
  );
  const meta = await blogQuery.countTotal();

  return { data, meta };
};

export const getAllBlogsAdminService = async (
  query: Record<string, unknown>,
) => {
  const blogQuery = new QueryBuilder(
    Blog.find({ isDeleted: false }),
    query,
  )
    .search(["title", "summary"])
    .filter(["status"])
    .sort()
    .paginate();

  const data = await blogQuery.modelQuery;
  const meta = await blogQuery.countTotal();

  return { data, meta };
};

export const getBlogBySlugService = async (slug: string) => {
  // Atomically fetch and increment view count
  const blog = await Blog.findOneAndUpdate(
    { slug, status: "PUBLISHED", isDeleted: false },
    { $inc: { views: 1 } },
    { new: true },
  ).select("-addedBy -isDeleted -deletedAt");

  if (!blog) {
    throw new ApiError(404, "Blog not found", "getBlogBySlug");
  }

  return blog;
};

export const updateBlogService = async (
  id: string,
  data: Partial<Omit<IBlog, "addedBy" | "views" | "readTime" | "publishedAt">>,
) => {
  const existing = await Blog.findOne({ _id: id, isDeleted: false });
  if (!existing) {
    throw new ApiError(404, "Blog not found", "updateBlog");
  }

  const updatePayload: Record<string, unknown> = { ...data };

  // Replicate pre-save readTime logic for findByIdAndUpdate (hooks don't run)
  if (data.content) {
    const wordCount = data.content.trim().split(/\s+/).length;
    updatePayload.readTime = Math.ceil(wordCount / 200);
  }

  // Replicate pre-save publishedAt logic for findByIdAndUpdate
  if (data.status === "PUBLISHED" && !existing.publishedAt) {
    updatePayload.publishedAt = new Date();
  }

  const blog = await Blog.findByIdAndUpdate(id, updatePayload, {
    new: true,
    runValidators: true,
  });

  return blog;
};

export const softDeleteBlogService = async (id: string) => {
  const blog = await Blog.findOne({ _id: id, isDeleted: false });
  if (!blog) {
    throw new ApiError(404, "Blog not found", "deleteBlog");
  }

  await Blog.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() });
  return { _id: blog._id, title: blog.title };
};
