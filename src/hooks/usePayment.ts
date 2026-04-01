import {
  createPayment,
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
