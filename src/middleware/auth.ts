import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { IJwtPayload } from "../interfaces";
import { User } from "../models/user.model";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { UserRoleEnum } from "../enums";

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    throw new AppError("Not authorized. Token missing.", 401);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as IJwtPayload;
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new AppError("Not authorized. User no longer exists.", 401);
    }

    req.user = user;
    next();
  } catch {
    throw new AppError("Not authorized. Invalid or expired token.", 401);
  }
});

export const auth =
  (...roles: UserRoleEnum[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Forbidden. Insufficient permissions.", 403));
    }
    next();
  };
