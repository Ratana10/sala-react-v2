import api from "./lib/axios";
import type { OrderType } from "@/validators/order.schema";

export const createOrder = async (request: OrderType) => {
  return await api.post(`/api/v1/orders`, request);
};

export const generatePdf = async (orderId: number): Promise<Blob> => {
  const response = await api.get<Blob>(
    `/api/v1/orders/${orderId}/generate-pdf`,
    {
      responseType: "blob",
    },
  );

  if (!response.data) {
    throw new Error("No PDF data received");
  }

  return response.data;
};
