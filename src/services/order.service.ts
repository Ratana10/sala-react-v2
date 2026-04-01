
import api from "./lib/axios";
import type { OrderType } from "@/validators/order.schema";

export const createOrder = async (request: OrderType) => {
  return await api.post(`/api/v1/orders`, request);
};
