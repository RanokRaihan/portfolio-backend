import ApiError from "../../errors/ApiError";
import { ICertification } from "./certification.interface";
import Certification from "./certification.model";

const createCertificationService = async (data: ICertification) => {
  if (data.isLifetime && data.expiresAt) {
    throw new ApiError(400, "Cannot set expiresAt when isLifetime is true", "createCertification");
  }
  if (data.isLifetime === false && !data.expiresAt) {
    throw new ApiError(400, "expiresAt is required when isLifetime is false", "createCertification");
  }

  const certification = await Certification.create(data);
  return certification;
};

const getCertificationByIdService = async (id: string) => {
  const certification = await Certification.findOne({ _id: id, isDeleted: false }).select(
    "-addedBy -isDeleted -deletedAt",
  );
  if (!certification) {
    throw new ApiError(404, "Certification not found", "getCertificationById");
  }
  return certification;
};

const getAllCertificationsService = async () => {
  const certifications = await Certification.find({ isDeleted: false })
    .sort({ sortOrder: 1, issuedAt: -1 })
    .select("-addedBy -isDeleted -deletedAt");

  return certifications;
};

const updateCertificationService = async (
  id: string,
  data: Partial<Omit<ICertification, "addedBy">>,
) => {
  const existing = await Certification.findOne({ _id: id, isDeleted: false });
  if (!existing) {
    throw new ApiError(404, "Certification not found", "updateCertification");
  }

  if (data.isLifetime && data.expiresAt) {
    throw new ApiError(400, "Cannot set expiresAt when isLifetime is true", "updateCertification");
  }

  const updatePayload: Record<string, unknown> = { ...data };

  if (data.isLifetime) {
    await Certification.updateOne({ _id: id }, { $unset: { expiresAt: "" } });
    delete updatePayload.expiresAt;
  }

  const certification = await Certification.findByIdAndUpdate(id, updatePayload, {
    new: true,
    runValidators: true,
  });

  return certification;
};

const softDeleteCertificationService = async (id: string) => {
  const certification = await Certification.findOne({ _id: id, isDeleted: false });
  if (!certification) {
    throw new ApiError(404, "Certification not found", "deleteCertification");
  }

  await Certification.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() });
  return { _id: certification._id, name: certification.name };
};

export {
  createCertificationService,
  getCertificationByIdService,
  getAllCertificationsService,
  softDeleteCertificationService,
  updateCertificationService,
};
