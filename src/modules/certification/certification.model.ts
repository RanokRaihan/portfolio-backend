import mongoose from "mongoose";
import { ICertification } from "./certification.interface";

const certificationSchema = new mongoose.Schema<ICertification>(
  {
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true, trim: true }, // "AWS Certified Developer"
    issuer: { type: String, required: true, trim: true }, // "Amazon Web Services"
    issuerLogoUrl: { type: String },
    credentialId: { type: String }, // cert ID for verification
    credentialUrl: { type: String }, // verify link
    certificateUrl: { type: String }, // link to certificate image or PDF
    badgeUrl: { type: String }, // badge image

    isExpired: { type: Boolean, default: false },
    isLifetime: { type: Boolean, default: true }, // never expires

    courseStartDate: { type: Date }, // when you started the course
    courseEndDate: { type: Date }, // when you completed the course

    issuedAt: { type: Date, required: true },
    expiresAt: { type: Date }, // null if isLifetime

    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true, versionKey: false },
);

certificationSchema.index({ isExpired: 1 });
certificationSchema.index({ featured: 1 });
certificationSchema.index({ isDeleted: 1 });

const Certification = mongoose.model("Certification", certificationSchema);
export default Certification;
