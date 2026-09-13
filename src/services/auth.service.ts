import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { IPublicUser, IUser } from "../interfaces";
import { User } from "../models";
import { AppError } from "../utils/AppError";

const signToken = (id: string) => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign({ id }, env.JWT_SECRET, options);
};

const sanitizeUser = (user: IPublicUser): IPublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const registerUser = async (input: {
  name: string;
  email: string;
  password: string;
}) => {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw new AppError("Email already registered", 409);
  }

  const user = await User.create(input);
  const token = signToken(user.id);

  return {
    token,
    user: sanitizeUser(user),
  };
};

const loginUser = async (input: { email: string; password: string }) => {
  const user = await User.findOne({ email: input.email }).select("+password");
  if (!user || !(await user.comparePassword(input.password))) {
    throw new AppError("Invalid email or password", 401);
  }

  return {
    token: signToken(user.id),
    user: sanitizeUser(user),
  };
};

export const authService = {
  sanitizeUser,
  registerUser,
  loginUser,
};
