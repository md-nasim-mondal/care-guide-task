import { Types } from "mongoose";

export interface INote {
  title: string;
  content: string;
  author: Types.ObjectId;
  priority: "LOW" | "MEDIUM" | "HIGH";
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
