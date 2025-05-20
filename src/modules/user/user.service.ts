import { IUser } from "./user.interface";
import User from "./user.model";

export const findUserWithEmailService = async (email: string) => {
  const user = await User.findOne({ email });
  return user;
};

//create a user with the given data
export const createUserService = async (data: IUser) => {
  const user = await User.create(data);
  return user;
};
