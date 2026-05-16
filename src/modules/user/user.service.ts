import ApiError from "../../errors/ApiError";
import { IUser } from "./user.interface";
import User from "./user.model";

export const findUserWithEmailService = async (email: string) => {
  const user = await User.findOne({ email });
  return user;
};

//create a user with the given data
export const createUserService = async (data: IUser) => {
  try {
    const user = await User.create(data);
    if (!user?._id) {
      throw new ApiError(500, "Failed to create user", "userCreation");
    }
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new ApiError(500, "Failed to create user", "userCreation");
  }
};
