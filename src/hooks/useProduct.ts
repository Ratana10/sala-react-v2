import {
  createProduct,
  deleteProductImage,
  fetchProduct,
  fetchProductById,
  updateProduct,
  uploadProductImage,
} from "@/services/product.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useProducts = (search?: string, page?: number, limit?: number) => {
  return useQuery({
    queryKey: ["products", search, page, limit],
    queryFn: () => fetchProduct(search, page, limit),
  });
};

export const useProductById = (id: number) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to created product");
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
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to created product");
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
      toast.success("Product image uploaded successfully");
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
    mutationFn: ({ id }: { id: number }) => deleteProductImage(id),
    onSuccess: () => {
      toast.success("Product image deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete product image");
      console.log("Failed to delete product image", error);
    },
  });
};
