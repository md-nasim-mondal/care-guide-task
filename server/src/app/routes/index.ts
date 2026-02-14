import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { NoteRoutes } from "../modules/note/note.route";
import { PostRoutes } from "../modules/post/post.route";

import { AuthRoutes } from "../modules/auth/auth.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/notes",
    route: NoteRoutes,
  },
  {
    path: "/posts",
    route: PostRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
