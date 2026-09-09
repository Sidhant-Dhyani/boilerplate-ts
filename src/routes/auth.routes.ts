import { Router } from "express";
import { login, me, register } from "../controllers/auth.controller";
import { authLimiter } from "../middleware/rateLimiter";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../validators/auth.validator";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.get("/me", protect, me);

export default router;
