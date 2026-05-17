import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    institution: { type: String, required: true, trim: true },
    degree: { type: String, trim: true }, // "Bachelor of Science"
    field: { type: String, trim: true }, // "Computer Science"
    description: { type: String }, // extra context, achievements
    logoUrl: { type: String }, // institution logo

    location: { type: String }, // "New York, NY" or "Online"
    isCurrent: { type: Boolean, default: false },

    startDate: { type: Date, required: true },
    endDate: { type: Date }, // null if isCurrent

    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Education = mongoose.model("Education", educationSchema);
export default Education;
