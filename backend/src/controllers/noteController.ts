import { Request, Response } from "express";
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../services/noteService";

export const createNoteController = async (
  req: Request,
  res: Response
) => {
  try {
    const note = await createNote(req.body);

    res.status(201).json(note);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create note",
    });
  }
};

export const getAllNotesController = async (
  req: Request,
  res: Response
) => {
  try {
    const notes = await getAllNotes();

    res.json(notes);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch notes",
    });
  }
};

export const getNoteByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const note = await getNoteById(id);

    if (!note) {
      return res.status(404).json({
        error: "Note not found",
      });
    }

    res.json(note);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch note",
    });
  }
};

export const updateNoteController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const note = await updateNote(id, req.body);

    res.json(note);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update note",
    });
  }
};

export const deleteNoteController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await deleteNote(id);

    res.status(204).send();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete note",
    });
  }
};