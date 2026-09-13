import { authService } from "../services";
import { asyncHandler } from "../utils/asyncHandler";

const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json({
    success: true,
    ...result,
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.json({
    success: true,
    ...result,
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: authService.sanitizeUser(req.user!),
  });
});

export const authController = {
  register,
  login,
  me,
};
