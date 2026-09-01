import { prisma } from "../prisma";

export const createLink = async (data: {
  title: string;
  url: string;
  description?: string;
}) => {
  return await prisma.savedLink.create({
    data,
  });
};

export const getAllLinks = async () => {
  return await prisma.savedLink.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getLinkById = async (id: number) => {
  return await prisma.savedLink.findUnique({
    where: {
      id,
    },
  });
};

export const updateLink = async (
  id: number,
  data: {
    title?: string;
    url?: string;
    description?: string;
  }
) => {
  return await prisma.savedLink.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteLink = async (id: number) => {
  return await prisma.savedLink.delete({
    where: {
      id,
    },
  });
};