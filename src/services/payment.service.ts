import api from "./lib/axios";

export interface IPaymentPayload {
  method: string;
}
export const createPayment = async (
  orderId: number,
  request: IPaymentPayload,
) => {
  return await api.post(`/api/v1/payments/${orderId}`, request);
};

export const createPaymentQr = async (
  orderId: number,
  request: IPaymentPayload,
) => {
  return await api.post(`/api/v1/payments/${orderId}/generate-qr`, request);
};
