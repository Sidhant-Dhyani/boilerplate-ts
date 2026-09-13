import { userService } from "../services";
import { asyncHandler } from "../utils/asyncHandler";

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  res.json({ success: true, data: users });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});

export const userController = {
  getUsers,
  getMe,
  createUser,
};
