import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Name cannot be empty!",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: (value: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: "Invalid email format!",
      },
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "moderator",
      enum: ["moderator", "admin"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//hash the password before saving the user
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    // hash the password
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});
const User = model<IUser>("User", userSchema);

export default User;
