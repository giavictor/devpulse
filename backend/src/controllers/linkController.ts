import { Request, Response } from "express";
import {
  createLink,
  getAllLinks,
  getLinkById,
  updateLink,
  deleteLink,
} from "../services/linkService";

export const createLinkController = async (
  req: Request,
  res: Response
) => {
  try {
    const link = await createLink(req.body);
    res.status(201).json(link);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create link",
    });
  }
};

export const getAllLinksController = async (
  req: Request,
  res: Response
) => {
  try {
    const links = await getAllLinks();
    res.json(links);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch links",
    });
  }
};

export const getLinkByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const link = await getLinkById(id);

    if (!link) {
      return res.status(404).json({
        error: "Link not found",
      });
    }

    res.json(link);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch link",
    });
  }
};

export const updateLinkController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const link = await updateLink(id, req.body);

    res.json(link);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to update link",
    });
  }
};

export const deleteLinkController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    await deleteLink(id);

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to delete link",
    });
  }
};