/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { NoteServices } from "./note.service";

const createNote = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (req as any).user as JwtPayload;
    const result = await NoteServices.createNote(req.body, user);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Note created successfully",
      data: result,
    });
  },
);

const getMyNotes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (req as any).user as JwtPayload;
    const result = await NoteServices.getMyNotes(
      req.query as Record<string, string>,
      user,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Notes retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getAllNotes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await NoteServices.getAllNotes(
      req.query as Record<string, string>,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All notes retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getSingleNote = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (req as any).user as JwtPayload;
    const result = await NoteServices.getSingleNote(
      req.params.id as string,
      user,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Note retrieved successfully",
      data: result,
    });
  },
);

const updateNote = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (req as any).user as JwtPayload;
    const result = await NoteServices.updateNote(
      req.params.id as string,
      req.body,
      user,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Note updated successfully",
      data: result,
    });
  },
);

const deleteNote = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (req as any).user as JwtPayload;
    await NoteServices.deleteNote(req.params.id as string, user);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Note deleted successfully",
      data: null,
    });
  },
);

export const NoteControllers = {
  createNote,
  getMyNotes,
  getAllNotes,
  getSingleNote,
  updateNote,
  deleteNote,
};
