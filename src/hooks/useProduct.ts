import { createProduct, deleteProductImage, fetchProduct, updateProduct, uploadProductImage } from "@/services/product.service";
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: File }) =>
      uploadProductImage(id, request),
    onSuccess: () => {
      console.log("Product image uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      console.log("Failed to upload product image", error);
    },
  });
};

export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: number) => deleteProductImage(imageId),
    onSuccess: () => {
      console.log("Product image deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      console.log("Failed to delete product image", error);
    },
  });
};
