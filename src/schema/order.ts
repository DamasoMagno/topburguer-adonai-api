import z from "zod";

export const orderSchema = z.object({
  status: z.string(),
  isCancelled: z.boolean(),
  totalPrice: z.number(),
  userId: z.number(),
  observations: z.string().optional(),
  orderItems: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number(),
      price: z.number(),
    })
  ),
});

export const orderItemSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  productId: z.number(),
  quantity: z.number(),
  price: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const orderIdParamSchema = z.object({
  id: z.coerce.number(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});
