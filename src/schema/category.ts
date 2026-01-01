import z from "zod";

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createCategorySchema = z.object({
  name: z.string(),
});

export const categoryIdParamSchema = z.object({
  id: z.coerce.number(),
});

export const updateCategorySchema = z.object({
  name: z.string().optional(),
});
