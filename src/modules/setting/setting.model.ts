import mongoose from "mongoose";
import { ISiteSettings } from "./setting.interface";

// Single-document collection — only one ever exists.
const siteSettingsSchema = new mongoose.Schema<ISiteSettings>(
  {
    // Identity
    name: { type: String, required: true }, // "Ranok"
    title: { type: String }, // "Full Stack Developer"
    bio: { type: String }, // short hero paragraph
    avatar: { type: String }, // Cloudinary URL
    resumeUrl: { type: String }, // PDF link

    // Status
    openToWork: { type: Boolean, default: false },
    availableFrom: { type: Date }, // if not immediately available

    // Social links
    socials: {
      github: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
      devTo: { type: String },
      youtube: { type: String },
      email: { type: String },
    },

    // SEO defaults (fallback for pages that don't have their own)
    metaTitle: { type: String },
    metaDescription: { type: String },
    ogImage: { type: String },

    // Footer
    footerText: { type: String }, // "© 2025 Ranok. All rights reserved."
  },
  { timestamps: true },
);

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);
export default SiteSettings;
