import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { IPublicUser, IUser } from "../interfaces";
import { User } from "../models/user";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

const signToken = (id: string) => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign({ id }, env.JWT_SECRET, options);
};

const sanitizeUser = (user: IUser | IPublicUser): IPublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("Email already registered", 409);
  }

  const user = await User.create({ name, email, password });
  const token = signToken(user.id);

  res.status(201).json({
    success: true,
    token,
    user: sanitizeUser(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken(user.id);

  res.json({
    success: true,
    token,
    user: sanitizeUser(user),
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: sanitizeUser(req.user!),
  });
});
