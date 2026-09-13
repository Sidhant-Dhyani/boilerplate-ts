import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../interfaces";
import { UserRoleEnum } from "../enums";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRoleEnum),
      default: UserRoleEnum.user,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function hashPassword(this: IUser) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function comparePassword(
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
