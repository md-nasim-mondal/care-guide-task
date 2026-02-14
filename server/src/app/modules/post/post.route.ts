import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { PostControllers } from "./post.controller";
import { createPostZodSchema } from "./post.validation";

const router = express.Router();

router.post(
  "/",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createPostZodSchema),
  PostControllers.createPost,
);

router.get(
  "/",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  PostControllers.getAllPosts,
);

router.delete(
  "/:id",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  PostControllers.deletePost,
);

export const PostRoutes = router;
