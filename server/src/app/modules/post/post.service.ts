import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../errorHelpers/ApiError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IPost } from "./post.interface";
import { Post } from "./post.model";

const createPost = async (payload: IPost, user: JwtPayload) => {
  const post = await Post.create({
    ...payload,
    author: user.userId,
  });
  return post;
};

const getAllPosts = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Post.find().populate("author", "name email"),
    query,
  );
  const postsData = queryBuilder
    .filter()
    .search(["content"])
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    postsData.build(),
    queryBuilder.getMeta(),
  ]);
  return { data, meta };
};

const deletePost = async (id: string, user: JwtPayload) => {
  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  if (
    user.role !== "ADMIN" &&
    user.role !== "SUPER_ADMIN" &&
    post.author.toString() !== user.userId
  ) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only delete your own posts",
    );
  }

  await Post.findByIdAndDelete(id);
  return null;
};

const updatePost = async (
  id: string,
  payload: Partial<IPost>,
  user: JwtPayload,
) => {
  const post = await Post.findById(id);

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  if (
    user.role !== "ADMIN" &&
    user.role !== "SUPER_ADMIN" &&
    post.author.toString() !== user.userId
  ) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only edit your own posts",
    );
  }

  const result = await Post.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate("author", "name email");

  return result;
};

export const PostServices = {
  createPost,
  getAllPosts,
  deletePost,
  updatePost,
};
