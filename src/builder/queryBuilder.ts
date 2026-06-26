import { Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, any>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, any>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // Applies text-based search on specified fields.
  search(searchableFields: string[]) {
    const searchTerm = this.query.search;
    if (searchTerm) {
      const escaped = String(searchTerm).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: escaped, $options: "i" },
        })),
      });
    }
    return this;
  }

  // Applies sorting based on query parameters. Pass allowedFields to restrict sortable columns.
  sort(allowedFields?: string[]) {
    const requested = this.query.sortBy || "createdAt";
    const sortBy =
      allowedFields && !allowedFields.includes(requested) ? "createdAt" : requested;
    const sortOrder = this.query.sortOrder === "desc" ? -1 : 1;
    this.modelQuery = this.modelQuery.sort({ [sortBy]: sortOrder });
    return this;
  }

  // Filters based on specific fields.
  filter(filters: string[]) {
    filters.forEach((filter) => {
      if (this.query[filter]) {
        this.modelQuery = this.modelQuery.find({
          [filter]: this.query[filter],
        });
      }
    });

    return this;
  }

  // Applies pagination based on query parameters. Limit is capped at 100.
  paginate() {
    const page = parseInt(this?.query?.page, 10) || 1;
    const rawLimit = parseInt(this?.query?.limit, 10) || 10;
    const limit = Math.min(rawLimit, 100);
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const rawLimit = Number(this?.query?.limit) || 10;
    const limit = Math.min(rawLimit, 100);
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }

  fields(fields: string) {
    if (fields) {
      this.modelQuery = this.modelQuery.select(fields);
    }
    return this;
  }
}

export default QueryBuilder;
