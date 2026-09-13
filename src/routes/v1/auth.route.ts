import { Router } from "express";
import { authController } from "../../controllers";
import { authLimiter } from "../../middleware/rateLimiter";
import { protect } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
} from "../../validators/auth.validator";

const router = Router();

router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  authController.register,
);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post(
  "/refresh",
  authLimiter,
  validate(refreshTokenSchema),
  authController.refresh,
);
router.post("/logout", validate(logoutSchema), authController.logout);
router.post("/logout-all", protect, authController.logoutAll);
router.get("/me", protect, authController.me);

export default router;
