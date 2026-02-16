/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PostServices } from "./post.service";

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as JwtPayload;
    const result = await PostServices.createPost(req.body, user);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post created successfully",
      data: result,
    });
  },
);

const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await PostServices.getAllPosts(
      req.query as Record<string, string>,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Posts retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as JwtPayload;
    await PostServices.deletePost(req.params.id as string, user);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post deleted successfully",
      data: null,
    });
  },
);

const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as JwtPayload;
    const result = await PostServices.updatePost(
      req.params.id as string,
      req.body,
      user,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post updated successfully",
      data: result,
    });
  },
);

export const PostControllers = {
  createPost,
  getAllPosts,
  deletePost,
  updatePost,
};
