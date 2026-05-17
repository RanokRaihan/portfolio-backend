import { Resend } from "resend";
import { config } from "../../config";
import ApiError from "../../errors/ApiError";
import { newMessageNotificationTemplate } from "../../utils/emailTemplates";
import QueryBuilder from "../../builder/queryBuilder";
import { IMessage, TMessageStatus } from "./message.interface";
import Contact from "./message.model";

const resend = new Resend(config.resend.apiKey);

export const submitMessageService = async (data: IMessage) => {
  const saved = await Contact.create(data);

  resend.emails
    .send({
      from: config.resend.fromEmail,
      to: config.myEmail,
      subject: data.subject
        ? `New message: ${data.subject}`
        : `New message from ${data.name}`,
      html: newMessageNotificationTemplate(
        data.name,
        data.email,
        data.subject,
        data.message,
      ),
    })
    .catch((err) => {
      console.error("[message] notification email failed:", err);
    });

  return { _id: saved._id };
};

export const getAllMessagesService = async (query: Record<string, unknown>) => {
  const messageQuery = new QueryBuilder(Contact.find(), query)
    .search(["name", "email", "subject"])
    .filter(["status"])
    .sort()
    .paginate();

  const data = await messageQuery.modelQuery;
  const meta = await messageQuery.countTotal();

  return { data, meta };
};

export const getMessageByIdService = async (id: string) => {
  const contact = await Contact.findById(id);
  if (!contact) {
    throw new ApiError(404, "Message not found", "getMessageById");
  }

  if (contact.status === "UNREAD") {
    contact.status = "READ";
    await contact.save();
  }

  return contact;
};

export const updateMessageStatusService = async (
  id: string,
  status: TMessageStatus,
) => {
  const contact = await Contact.findById(id);
  if (!contact) {
    throw new ApiError(404, "Message not found", "updateMessageStatus");
  }

  const updated = await Contact.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true },
  );

  return updated;
};

export const deleteMessageService = async (id: string) => {
  const contact = await Contact.findById(id);
  if (!contact) {
    throw new ApiError(404, "Message not found", "deleteMessage");
  }

  await Contact.findByIdAndDelete(id);
  return { _id: contact._id };
};
