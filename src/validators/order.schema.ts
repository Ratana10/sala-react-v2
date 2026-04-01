import * as z from "zod";

export const orderSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  customerId: z.number().min(1, "Customer is required"),
  location: z.string().min(1, "Location is required"),
  discount: z.number().min(0, "Discount must be greater than or equal to 0"),
  items: z.array(
    z.object({
      productId: z.number().min(1, "Product is required"),
      qty: z.number().min(1, "Quantity must be greater than or equal to 1"),
    }),
  ),
});

export type OrderType= z.infer<typeof orderSchema>;
