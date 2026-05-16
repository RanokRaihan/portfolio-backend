import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";
import { IUser, UserRole } from "./user.interface";

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
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpires: {
      type: Date,
    },
    image: {
      type: String,
    },
    dateOfBirth: {
      required: true,
      type: Date,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
      enum: ["male", "female", "other"],
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: UserRole.MODERATOR,
      enum: Object.values(UserRole),
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationTokenExpires: {
      type: Date,
    },
    emailVerifiedAt: {
      type: Date,
    },
    needPasswordChange: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
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
