import z from "zod";

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  categoryId: z.number(),
  imageUrl: z.url().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  category_id: z.number(),
  imageUrl: z.string().url().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  category_id: z.number().optional(),
  imageUrl: z.string().url().optional(),
});

export const productIdParamSchema = z.object({
  id: z.coerce.number(),
});
