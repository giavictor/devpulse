import { prisma } from "../prisma";

export const createNote = async (data: {
  title: string;
  content: string;
}) => {
  return await prisma.note.create({
    data,
  });
};

export const getAllNotes = async () => {
  return await prisma.note.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getNoteById = async (id: number) => {
  return await prisma.note.findUnique({
    where: {
      id,
    },
  });
};

export const updateNote = async (
  id: number,
  data: {
    title?: string;
    content?: string;
  }
) => {
  return await prisma.note.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteNote = async (id: number) => {
  return await prisma.note.delete({
    where: {
      id,
    },
  });
};