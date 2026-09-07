import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  createNoteController,
  getAllNotesController,
  getNoteByIdController,
  updateNoteController,
  deleteNoteController,
} from "../controllers/noteController";

const router = Router();

const noteSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

const validateNote = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = noteSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.issues.map((issue) => issue.message),
    });
  }

  req.body = result.data;
  next();
};

router.post("/", validateNote, createNoteController);
router.get("/", getAllNotesController);
router.get("/:id", getNoteByIdController);
router.put("/:id", validateNote, updateNoteController);
router.delete("/:id", deleteNoteController);

export default router;