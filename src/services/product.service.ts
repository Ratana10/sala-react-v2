import type { ProductSchema } from "@/components/products/ProductForm";

export const fetchProduct = async (search?: string) => {
  const res = await fetch(`http://localhost:3000/api/v1/products?search=${search}`);

  const data = await res.json();

  console.log("Fetched data", data);
  return data;
};

export const createProduct = async (request: ProductSchema)=>{
  const res = await fetch(`http://localhost:3000/api/v1/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });


  const data = await res.json()
  return data;
}

export const updateProduct = async (id: number, request: ProductSchema)=>{
  const res = await fetch(`http://localhost:3000/api/v1/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });


  const data = await res.json()
  return data;
}