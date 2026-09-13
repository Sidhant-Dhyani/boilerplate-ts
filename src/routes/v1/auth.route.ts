import { Router } from "express";
import { authController } from "../../controllers";
import { authLimiter } from "../../middleware/rateLimiter";
import { auth, protect } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { loginSchema, registerSchema } from "../../validators/auth.validator";
import { UserRoleEnum } from "../../enums";

const router = Router();

router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  authController.register,
);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.get("/me", protect, auth(UserRoleEnum.user), authController.me);

export default router;
