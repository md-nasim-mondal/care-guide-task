import { Types } from "mongoose";

export interface IPost {
  content: string;
  author: Types.ObjectId;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
