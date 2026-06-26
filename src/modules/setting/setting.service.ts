import ApiError from "../../errors/ApiError";
import { ISiteSettings } from "./setting.interface";
import SiteSettings from "./setting.model";

const createSettingService = async (data: ISiteSettings) => {
  const existing = await SiteSettings.findOne({});
  if (existing) {
    throw new ApiError(
      409,
      "Site settings already exist. Use PATCH to update.",
      "createSetting",
    );
  }

  const setting = await SiteSettings.create(data);
  return setting;
};

const getSettingPublicService = async () => {
  const setting = await SiteSettings.findOne({}).select(
    "-__v -updatedAt",
  );
  if (!setting) {
    throw new ApiError(404, "Site settings not found", "getSetting");
  }
  return setting;
};

const getSettingAdminService = async () => {
  const setting = await SiteSettings.findOne({});
  if (!setting) {
    throw new ApiError(404, "Site settings not found", "getSetting");
  }
  return setting;
};

// Flatten socials to dot-notation so PATCH preserves unmentioned social links
const buildUpdatePayload = (data: Partial<ISiteSettings>): Record<string, unknown> => {
  const payload: Record<string, unknown> = { ...data };

  if (data.socials) {
    delete payload.socials;
    for (const [key, value] of Object.entries(data.socials)) {
      payload[`socials.${key}`] = value;
    }
  }

  return payload;
};

const updateSettingService = async (data: Partial<ISiteSettings>) => {
  const existing = await SiteSettings.findOne({});
  if (!existing) {
    throw new ApiError(
      404,
      "Site settings not found. Use POST to create them first.",
      "updateSetting",
    );
  }

  const updatePayload = buildUpdatePayload(data);

  const setting = await SiteSettings.findByIdAndUpdate(existing._id, updatePayload, {
    new: true,
    runValidators: true,
  });

  return setting;
};

export {
  createSettingService,
  getSettingAdminService,
  getSettingPublicService,
  updateSettingService,
};
