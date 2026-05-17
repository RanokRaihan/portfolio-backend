import mongoose from "mongoose";
import { IProject } from "./project.interface";

const projectSchema = new mongoose.Schema<IProject>(
  {
    // Author
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Core info
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    tagline: { type: String, required: true, trim: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    challenges: { type: String },
    lessons: { type: String },

    // Tech stack
    techStack: {
      frontend: [{ type: String }],
      backend: [{ type: String }],
      database: [{ type: String }],
      devops: [{ type: String }],
      other: [{ type: String }],
    },

    // Media
    coverImage: { type: String },
    thumbnailImage: { type: String },
    images: [{ type: String }],
    videoUrl: { type: String },
    demoGifUrl: { type: String },

    // Metadata
    tags: [{ type: String }],
    category: {
      type: String,
      enum: [
        "FULL_STACK",
        "FRONTEND",
        "BACKEND",
        "MOBILE",
        "CLI_TOOL",
        "LIBRARY",
        "API",
        "PACKAGE",
        "OTHER",
      ],
      required: true,
    },
    type: {
      type: String,
      enum: [
        "PERSONAL",
        "FREELANCE",
        "OPEN_SOURCE",
        "CLIENT",
        "HACKATHON",
        "OTHER",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED", "IN_PROGRESS", "COMING_SOON"],
      default: "DRAFT",
    },
    complexity: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      required: true,
    },

    // Links
    frontendLiveUrl: { type: String },
    frontendRepoUrl: { type: String },
    backendLiveUrl: { type: String },
    backendRepoUrl: { type: String },
    caseStudyUrl: { type: String },
    npmUrl: { type: String },
    devToUrl: { type: String },
    figmaUrl: { type: String },

    // Stats
    linesOfCode: { type: Number },
    githubStars: { type: Number },
    npmDownloads: { type: Number },
    activeUsers: { type: Number },

    // Team
    teamSize: { type: Number, default: 1 },
    myRole: { type: String, required: true },
    contributors: [{ type: String }],

    // SEO
    metaTitle: { type: String },
    metaDescription: { type: String },
    ogImage: { type: String },

    // Ordering & visibility
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    isFeaturedOnHome: { type: Boolean, default: false },
    // Soft delete
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deletedAt: { type: Date },

    // Timestamps
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Auto-generate slug from title if not provided
projectSchema.pre("save", function (next) {
  if (!this.isModified("title") || this.slug) return next();
  this.slug = this.title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/--+/g, "-");
  next();
});

// Indexes
projectSchema.index({ slug: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ featured: 1, sortOrder: 1 });
projectSchema.index({ addedBy: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ category: 1, type: 1 });

const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project;
