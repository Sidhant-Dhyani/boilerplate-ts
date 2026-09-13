import { Document } from "mongoose";
import { UserRoleEnum } from "../enums";

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRoleEnum;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

export interface IPublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRoleEnum;
  createdAt: Date;
  updatedAt: Date;
}
