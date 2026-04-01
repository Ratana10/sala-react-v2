import { createOrder, generatePdf } from "@/services/order.service";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGeneratePdf = (orderId: number | undefined) => {
  return useQuery({
    queryKey: ["doc-pdf", orderId],
    queryFn: () => generatePdf(orderId!),
    enabled: !!orderId,
  });
};
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast.success("Order created successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to create order");
      console.log("Failed to create order", error);
    },
  });
};
