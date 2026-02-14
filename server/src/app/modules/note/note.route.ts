import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { NoteControllers } from "./note.controller";
import { createNoteZodSchema, updateNoteZodSchema } from "./note.validation";

const router = express.Router();

router.post(
  "/",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createNoteZodSchema),
  NoteControllers.createNote,
);

router.get(
  "/",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  NoteControllers.getMyNotes,
);

router.get(
  "/all-notes",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  NoteControllers.getAllNotes,
);

router.get(
  "/:id",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  NoteControllers.getSingleNote,
);

router.patch(
  "/:id",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateNoteZodSchema),
  NoteControllers.updateNote,
);

router.delete(
  "/:id",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  NoteControllers.deleteNote,
);

export const NoteRoutes = router;
