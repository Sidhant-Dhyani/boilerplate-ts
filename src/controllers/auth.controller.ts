import { authService } from "../services";
import { AppError } from "../utils/AppError";
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

const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refreshAuthTokens(req.body.refreshToken);
  res.json({
    success: true,
    ...result,
  });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

const logoutAll = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  await authService.logoutAll(req.user.id);
  res.json({
    success: true,
    message: "Logged out from all devices",
  });
});

const me = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  res.json({
    success: true,
    user: authService.sanitizeUser(req.user),
  });
});

export const authController = {
  register,
  login,
  refresh,
  logout,
  logoutAll,
  me,
};
