import mongoose from "mongoose";
import { IBlog } from "./blog.interface";

const blogSchema = new mongoose.Schema(
  {
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Core
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    tags: [{ type: String }],

    // Status
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
    },

    // Stats
    views: { type: Number, default: 0 },
    readTime: { type: Number },

    // SEO
    metaTitle: { type: String },
    metaDescription: { type: String },
    ogImage: { type: String },

    // Ordering
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date },

    // Soft delete
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

// Auto-generate slug from title on first save (only if no slug provided)
blogSchema.pre("validate", function (next) {
  if (!this.isModified("title") || this.slug) return next();
  this.slug = this.title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/--+/g, "-");
  next();
});

// Auto-calculate read time (avg 200 words/min)
blogSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    const wordCount = this.content.trim().split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  next();
});

// Set publishedAt when first published
blogSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "PUBLISHED" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
  next();
});

blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ featured: 1 });
blogSchema.index({ isDeleted: 1 });

const Blog = mongoose.model<IBlog>("Blog", blogSchema);
export default Blog;
