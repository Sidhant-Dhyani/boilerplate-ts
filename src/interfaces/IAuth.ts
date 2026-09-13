import { Document, Types } from "mongoose";

export interface IJwtPayload {
  id: string;
}

export interface IRefreshToken extends Document {
  user: Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
