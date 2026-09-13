import { NextFunction, Request, Response } from "express";
import passport from "../config/passport";
import { UserRoleEnum } from "../enums";
import { AppError } from "../utils/AppError";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: unknown, user: Express.User | false | undefined, info: unknown) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next(
          new AppError("Not authorized. Invalid or expired token.", 401),
        );
      }

      req.user = user;
      next();
    },
  )(req, res, next);
};

export const auth =
  (...roles: UserRoleEnum[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Forbidden. Insufficient permissions.", 403));
    }
    next();
  };
