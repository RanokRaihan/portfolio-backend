import { Schema, model } from "mongoose";
import { ISkill } from "./skill.interface";

const skillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "frontend",
        "backend",
        "fullstack",
        "database",
        "devops",
        "tools",
        "other",
      ],
    },
    image: { type: String, required: true },
    proficiencyLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
    },
    yearsOfExperience: { type: Number },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create indexes for faster queries
skillSchema.index({ name: 1 });
skillSchema.index({ category: 1 });
skillSchema.index({ featured: 1 });

const Skill = model<ISkill>("Skill", skillSchema);

export default Skill;
