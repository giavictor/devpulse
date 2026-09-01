import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  createLinkController,
  getAllLinksController,
  getLinkByIdController,
  updateLinkController,
  deleteLinkController,
} from "../controllers/linkController";

const router = Router();

const linkSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  description: z.string().optional(),
});

const validateLink = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = linkSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.issues.map((issue) => issue.message),
    });
  }

  req.body = result.data;
  next();
};

router.post("/", validateLink, createLinkController);
router.get("/", getAllLinksController);
router.get("/:id", getLinkByIdController);
router.put("/:id", validateLink, updateLinkController);
router.delete("/:id", deleteLinkController);

export default router;