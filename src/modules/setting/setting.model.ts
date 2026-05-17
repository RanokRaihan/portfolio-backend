import mongoose from "mongoose";
import { ISiteSettings } from "./setting.interface";

const siteSettingsSchema = new mongoose.Schema<ISiteSettings>(
  {
    name: { type: String, required: true },
    title: { type: String },
    bio: { type: String },
    avatar: { type: String },
    resumeUrl: { type: String },

    openToWork: { type: Boolean, default: false },
    availableFrom: { type: Date },

    socials: {
      github: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
      devTo: { type: String },
      youtube: { type: String },
      email: { type: String },
    },

    metaTitle: { type: String },
    metaDescription: { type: String },
    ogImage: { type: String },

    footerText: { type: String },
  },
  { timestamps: true },
);

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);
export default SiteSettings;
