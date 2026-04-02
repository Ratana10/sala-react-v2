import {
  createPayment,
  createPaymentQr,
  type IPaymentPayload,
} from "@/services/payment.service";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      request,
    }: {
      orderId: number;
      request: IPaymentPayload;
    }) => createPayment(orderId, request),

    onSuccess: () => {
      toast.success("Payment created successfully");
      queryClient.invalidateQueries({ queryKey: ["payment"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to create payment");
      console.log("Failed to create payment", error);
    },
  });
};

export const useCreatePaymentQr = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      request,
    }: {
      orderId: number;
      request: IPaymentPayload;
    }) => createPaymentQr(orderId, request),

    onSuccess: () => {
      toast.success("Payment QR created successfully");
      queryClient.invalidateQueries({ queryKey: ["payment"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to create payment QR");
      console.log("Failed to create payment QR", error);
    },
  });
};
