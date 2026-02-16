import { model, Schema } from "mongoose";
import { IPost } from "./post.interface";

const postSchema = new Schema<IPost>(
  {
    content: { type: String, required: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Indexed for $lookup aggregation
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes
postSchema.index({ author: 1 });

export const Post = model<IPost>("Post", postSchema);
