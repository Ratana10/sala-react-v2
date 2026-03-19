import { createProduct, fetchProduct, updateProduct, uploadProductImage } from "@/services/product.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useProducts = (search?: string, page?: number, limit?: number) => {
  return useQuery({
    queryKey: ["products", search, page, limit],
    queryFn: () => fetchProduct(search, page, limit),
  });
};

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
    mutationFn: ({ id, request }: { id: number; request: any }) =>
      updateProduct(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      console.log("Failed to create product", error);
    },
  });
};

export const useUploadProductImage = () => {
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      uploadProductImage(id, file),
    onError: (error: any) => {
      console.log("Failed to upload product image", error);
    },
  });
};
