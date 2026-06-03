import mongoose, { Schema } from "mongoose";
import { ISkill, SkillCategory, SkillLevel } from "./skill.interface";

const SKILL_CATEGORIES: SkillCategory[] = [
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "DEVOPS",
  "LANGUAGE",
  "TOOL",
  "OTHER",
];

const SKILL_LEVELS: SkillLevel[] = [
  "FAMILIAR",
  "PROFICIENT",
  "ADVANCED",
  "EXPERT",
];

const skillSchema = new Schema<ISkill>(
  {
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true, unique: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      enum: SKILL_CATEGORIES,
      required: true,
    },
    level: {
      type: String,
      enum: SKILL_LEVELS,
      required: true,
    },
    iconUrl: { type: String },
    iconName: { type: String },

    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

skillSchema.pre("validate", async function (next) {
  if (!this.isModified("name") || this.slug) return next();

  const baseSlug = this.name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/--+/g, "-");

  // Escape any regex metacharacters in the base slug before embedding in a pattern
  const escaped = baseSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const existing = await mongoose.model("Skill").distinct("slug", {
    slug: { $regex: `^${escaped}(-\\d+)?$` },
    _id: { $ne: this._id },
  });

  if (!existing.includes(baseSlug)) {
    this.slug = baseSlug;
    return next();
  }

  const maxSuffix = existing.reduce((max, s: string) => {
    const match = s.match(new RegExp(`^${escaped}-(\\d+)$`));
    return match ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 0);

  this.slug = `${baseSlug}-${maxSuffix + 1}`;
  next();
});

skillSchema.index({ category: 1, sortOrder: 1 });
skillSchema.index({ featured: 1 });

const Skill = mongoose.model<ISkill>("Skill", skillSchema);

export default Skill;
