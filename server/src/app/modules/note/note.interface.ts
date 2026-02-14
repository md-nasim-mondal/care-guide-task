import { Types } from "mongoose";

export interface INote {
  title: string;
  content: string;
  author: Types.ObjectId;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
