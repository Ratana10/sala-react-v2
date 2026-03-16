import { createProduct, updateProduct } from "@/services/product.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { id } from "zod/v4/locales";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      console.log("Failed to create product", error);
    },
  });
};


export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, request}: {id: number, request: any}) => updateProduct(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      console.log("Failed to create product", error);
    },
  });
};
