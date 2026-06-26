import QueryBuilder from "../../builder/queryBuilder";
import ApiError from "../../errors/ApiError";
import { ITestimonial } from "./testimonial.interface";
import Testimonial from "./testimonial.model";

export const createTestimonialService = async (data: ITestimonial) => {
  const testimonial = await Testimonial.create(data);
  return testimonial;
};

export const getFeaturedTestimonialsService = async (
  query: Record<string, unknown>,
) => {
  const testimonialQuery = new QueryBuilder(
    Testimonial.find({ isDeleted: false, isPublished: true, featured: true }),
    query,
  )
    .search(["name", "company", "quote"])
    .filter(["relation"])
    .sort()
    .paginate();

  const data = await testimonialQuery.modelQuery.select(
    "-addedBy -isDeleted -isPublished -email",
  );
  const meta = await testimonialQuery.countTotal();

  return { data, meta };
};

export const getAllTestimonialsService = async (
  query: Record<string, unknown>,
) => {
  const testimonialQuery = new QueryBuilder(
    Testimonial.find({ isDeleted: false, isPublished: true }),
    query,
  )
    .search(["name", "company", "quote"])
    .filter(["featured", "relation"])
    .sort()
    .paginate();

  const data = await testimonialQuery.modelQuery.select(
    "-addedBy -isDeleted -isPublished -email",
  );
  const meta = await testimonialQuery.countTotal();

  return { data, meta };
};

export const getAllTestimonialsAdminService = async (
  query: Record<string, unknown>,
) => {
  const testimonialQuery = new QueryBuilder(
    Testimonial.find({ isDeleted: false }),
    query,
  )
    .search(["name", "company", "quote"])
    .filter(["featured", "relation", "isPublished"])
    .sort()
    .paginate();

  const data = await testimonialQuery.modelQuery.select("-isDeleted");
  const meta = await testimonialQuery.countTotal();

  return { data, meta };
};

export const getTestimonialByIdService = async (id: string) => {
  const testimonial = await Testimonial.findOne({
    _id: id,
    isDeleted: false,
  }).select("-isDeleted");

  if (!testimonial) {
    throw new ApiError(404, "Testimonial not found", "getTestimonialById");
  }

  return testimonial;
};

export const updateTestimonialService = async (
  id: string,
  data: Partial<Omit<ITestimonial, "addedBy">>,
) => {
  const existing = await Testimonial.findOne({ _id: id, isDeleted: false });
  if (!existing) {
    throw new ApiError(404, "Testimonial not found", "updateTestimonial");
  }

  const updated = await Testimonial.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  return updated;
};

export const togglePublishTestimonialService = async (id: string) => {
  const existing = await Testimonial.findOne({ _id: id, isDeleted: false });
  if (!existing) {
    throw new ApiError(404, "Testimonial not found", "togglePublishTestimonial");
  }

  const updated = await Testimonial.findByIdAndUpdate(
    id,
    { isPublished: !existing.isPublished },
    { new: true },
  );

  return updated;
};

export const softDeleteTestimonialService = async (id: string) => {
  const testimonial = await Testimonial.findOne({ _id: id, isDeleted: false });
  if (!testimonial) {
    throw new ApiError(404, "Testimonial not found", "deleteTestimonial");
  }

  await Testimonial.findByIdAndUpdate(id, { isDeleted: true });
  return { _id: testimonial._id, name: testimonial.name };
};
