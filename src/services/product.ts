export const fetchProduct = async () => {
  const res = await fetch("https://api.escuelajs.co/api/v1/products");

  const data = await res.json();

  console.log("Fetched data", data);
  return data;
};

export type CreateProductInput = {
  name: string;
  price: number;
};

export const createProduct = async (data: CreateProductInput) => {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create product");
  return response.json();
};
