import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["UNREAD", "READ", "REPLIED", "ARCHIVED"],
      default: "UNREAD",
    },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true, versionKey: false },
);

contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
