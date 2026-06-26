export type TUserRole = "admin" | "moderator";
export interface IjwtPayload {
  name: string;
  _id: string;
  email: string;
  role: TUserRole;
  needPasswordChange: boolean;
  emailVerified: boolean;
}

export type LoggedinUser = {
  _id: string;
  email: string;
  name: string;
  role: string;
  needPasswordChange: boolean;
  emailVerified: boolean;
};
