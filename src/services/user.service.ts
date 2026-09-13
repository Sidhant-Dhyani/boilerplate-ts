import { UserRoleEnum } from "../enums";
import { User } from "../models/user.model";
import { AppError } from "../utils/AppError";

const getAllUsers = async () => {
  return User.find().select("-password");
};

const createUser = async (input: {
  name: string;
  email: string;
  password: string;
  role?: UserRoleEnum;
}) => {
  if (!input.name || !input.email || !input.password) {
    throw new AppError("Name, email, and password are required", 400);
  }

  const user = await User.create(input);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const userService = {
  getAllUsers,
  createUser,
};
