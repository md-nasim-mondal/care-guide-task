import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import { updateUserZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/register",
  // validateRequest(createUserZodSchema),
  UserControllers.createUser,
);
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers,
);
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);
router.get(
  "/get-grouped-users-by-interests",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getUsersByInterests,
);

router.get(
  "/get-user-posts/:id",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getUserPosts,
);

router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getSingleUser,
);
router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser,
);
// /api/v1/user/:id
export const UserRoutes = router;
