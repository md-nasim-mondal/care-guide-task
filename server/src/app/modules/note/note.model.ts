import { model, Schema } from "mongoose";
import { INote } from "./note.interface";

const noteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Indexed for listing user's notes
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes
noteSchema.index({ author: 1 });

export const Note = model<INote>("Note", noteSchema);
