import { Schema, model } from "mongoose";
import { IProject } from "./project.interface";

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    challenges: {
      type: [String],
      required: true,
    },
    technologies: {
      type: [String],
      required: true,
    },
    backendRepo: {
      type: String,
    },
    frontendRepo: {
      type: String,
    },
    backendLive: {
      type: String,
    },
    frontendLive: {
      type: String,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    keyFeatures: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "in-progress", "planned"],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create indexes for faster queries
projectSchema.index({ title: 1 });
projectSchema.index({ technologies: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ isFeatured: 1 });

const Project = model<IProject>("Project", projectSchema);

export default Project;
