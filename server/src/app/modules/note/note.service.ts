import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { INote } from "./note.interface";
import { Note } from "./note.model";
import { Role } from "../user/user.interface";

const createNote = async (payload: INote, user: JwtPayload) => {
  const note = await Note.create({
    ...payload,
    author: user.userId,
  });
  return note;
};

const getMyNotes = async (query: Record<string, string>, user: JwtPayload) => {
  const queryBuilder = new QueryBuilder(
    Note.find({ author: user.userId }),
    query,
  );
  const notesData = queryBuilder
    .filter()
    .search(["title", "content"])
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    notesData.build(),
    queryBuilder.getMeta(),
  ]);
  return { data, meta };
};

const getAllNotes = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Note.find().populate("author", "name email"),
    query,
  );
  const notesData = queryBuilder
    .filter()
    .search(["title", "content"])
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    notesData.build(),
    queryBuilder.getMeta(),
  ]);
  return { data, meta };
};

const getSingleNote = async (id: string, user: JwtPayload) => {
  const note = await Note.findById(id).populate("author", "name email");
  if (!note) {
    throw new AppError(httpStatus.NOT_FOUND, "Note not found");
  }

  if (
    user.role !== Role.ADMIN &&
    user.role !== Role.SUPER_ADMIN &&
    note.author._id.toString() !== user.userId
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to view this note",
    );
  }

  return note;
};

const updateNote = async (
  id: string,
  payload: Partial<INote>,
  user: JwtPayload,
) => {
  const note = await Note.findById(id);
  if (!note) {
    throw new AppError(httpStatus.NOT_FOUND, "Note not found");
  }

  if (note.author.toString() !== user.userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only update your own notes",
    );
  }

  const result = await Note.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteNote = async (id: string, user: JwtPayload) => {
  const note = await Note.findById(id);
  if (!note) {
    throw new AppError(httpStatus.NOT_FOUND, "Note not found");
  }

  if (note.author.toString() !== user.userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only delete your own notes",
    );
  }

  await Note.findByIdAndDelete(id);
  return null;
};

export const NoteServices = {
  createNote,
  getMyNotes,
  getAllNotes,
  getSingleNote,
  updateNote,
  deleteNote,
};
