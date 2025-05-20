export type TUserRole = "admin" | "moderator";
export interface IjwtPayload {
  name: string;
  _id: string;
  email: string;
  role?: TUserRole;
}
