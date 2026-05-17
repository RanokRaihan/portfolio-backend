import ApiError from "../../errors/ApiError";
import { IEducation } from "./education.interface";
import Education from "./education.model";

const createEducationService = async (data: IEducation) => {
  if (data.isCurrent && data.endDate) {
    throw new ApiError(400, "Cannot set end date when isCurrent is true", "createEducation");
  }

  const education = await Education.create(data);
  return education;
};

const getAllEducationService = async () => {
  const educations = await Education.find({ isDeleted: false })
    .sort({ sortOrder: 1, startDate: -1 })
    .select("-addedBy -isDeleted");

  return educations;
};

const updateEducationService = async (
  id: string,
  data: Partial<Omit<IEducation, "addedBy">>,
) => {
  const existing = await Education.findOne({ _id: id, isDeleted: false });
  if (!existing) {
    throw new ApiError(404, "Education record not found", "updateEducation");
  }

  if (data.isCurrent && data.endDate) {
    throw new ApiError(400, "Cannot set end date when isCurrent is true", "updateEducation");
  }

  const updatePayload: Record<string, unknown> = { ...data };

  if (data.isCurrent) {
    updatePayload.endDate = undefined;
    await Education.updateOne({ _id: id }, { $unset: { endDate: "" } });
    delete updatePayload.endDate;
  }

  const education = await Education.findByIdAndUpdate(id, updatePayload, {
    new: true,
    runValidators: true,
  });

  return education;
};

const softDeleteEducationService = async (id: string) => {
  const education = await Education.findOne({ _id: id, isDeleted: false });
  if (!education) {
    throw new ApiError(404, "Education record not found", "deleteEducation");
  }

  await Education.findByIdAndUpdate(id, { isDeleted: true });
  return { _id: education._id, institution: education.institution };
};

export {
  createEducationService,
  getAllEducationService,
  softDeleteEducationService,
  updateEducationService,
};
