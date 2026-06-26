export type TMessageStatus = "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";

export interface IMessage {
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: TMessageStatus;
  ipAddress?: string;
  userAgent?: string;
}
