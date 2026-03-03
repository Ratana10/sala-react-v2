import type { ProductSchema } from "@/components/products/ProductForm";

export const fetchProduct = async (search?: string) => {
  const res = await fetch(
    `http://localhost:3000/api/v1/products?search=${search}`,
  );

  const data = await res.json();

  console.log("Fetched data", data);
  return data;
};

export const createProduct = async (request: ProductSchema) => {
  const res = await fetch(`http://localhost:3000/api/v1/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error("Failed to create product");
  }

  const data = await res.json();
  return data;
};

export const uploadProduct = async (request: {
  productId: number;
  file: File;
}) => {
  const formData = new FormData();
  formData.append("file", request.file);

  const res = await fetch(
    `http://localhost:3000/api/v1/products/${request.productId}/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!res.ok) {
    throw new Error("Failed to upload product");
  }

  const data = await res.json();
  return data;
};
