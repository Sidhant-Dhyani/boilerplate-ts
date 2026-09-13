import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { IJwtPayload, IPublicUser, IUser } from "../interfaces";
import { RefreshToken, User } from "../models";
import { AppError } from "../utils/AppError";

const signAccessToken = (id: string) => {
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign({ id }, env.JWT_ACCESS_SECRET, options);
};

const signRefreshToken = (id: string) => {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign({ id }, env.JWT_REFRESH_SECRET, options);
};

const createTokenPair = async (userId: string) => {
  const accessToken = signAccessToken(userId);
  const refreshToken = signRefreshToken(userId);
  const decoded = jwt.decode(refreshToken) as { exp: number };

  await RefreshToken.create({
    user: userId,
    token: refreshToken,
    expiresAt: new Date(decoded.exp * 1000),
  });

  return { accessToken, refreshToken };
};

const sanitizeUser = (user: IUser): IPublicUser => ({
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
  const tokens = await createTokenPair(user.id);

  return {
    ...tokens,
    user: sanitizeUser(user),
  };
};

const loginUser = async (input: { email: string; password: string }) => {
  const user = await User.findOne({ email: input.email }).select("+password");
  if (!user || !(await user.comparePassword(input.password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const tokens = await createTokenPair(user.id);

  return {
    ...tokens,
    user: sanitizeUser(user),
  };
};

const refreshAuthTokens = async (refreshToken: string) => {
  let decoded: IJwtPayload;

  try {
    decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as IJwtPayload;
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const stored = await RefreshToken.findOne({
    token: refreshToken,
    user: decoded.id,
  });

  if (!stored) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  await stored.deleteOne();

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError("User no longer exists", 401);
  }

  const tokens = await createTokenPair(user.id);

  return {
    ...tokens,
    user: sanitizeUser(user),
  };
};

const logout = async (refreshToken: string) => {
  await RefreshToken.deleteOne({ token: refreshToken });
};

const logoutAll = async (userId: string) => {
  await RefreshToken.deleteMany({ user: userId });
};

export const authService = {
  sanitizeUser,
  registerUser,
  loginUser,
  refreshAuthTokens,
  logout,
  logoutAll,
};
