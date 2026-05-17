import mongoose from "mongoose";
import { ITestimonial } from "./testimonial.interface";

const testimonialSchema = new mongoose.Schema(
  {
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Person
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true, required: true }, // "Senior Engineer at Google"
    company: { type: String, trim: true },
    avatar: { type: String },
    linkedIn: { type: String }, // optional profile link

    // Content
    quote: { type: String, required: true }, // the actual testimonial
    relation: {
      type: String,
      enum: ["MENTOR", "PEER", "CLIENT", "INSTRUCTOR", "OTHER"],
      required: true,
    },

    // Ordering & visibility
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

testimonialSchema.index({ featured: 1, sortOrder: 1 });

const Testimonial = mongoose.model<ITestimonial>("Testimonial", testimonialSchema);
export default Testimonial;
