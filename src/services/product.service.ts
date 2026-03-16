const API_URL = import.meta.env.VITE_API_URL;

export interface ProductPayload {
  name: string;
  price: number;
  categoryId: number;
  qty: number;
}

export const fetchProduct = async (search?: string) => {
  const res = await fetch(`${API_URL}/api/v1/products?search=${search}`);

  const data = await res.json();

  console.log("Fetched data", data);
  return data;
};

export const createProduct = async (request: ProductPayload) => {
  const res = await fetch(`${API_URL}/api/v1/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });

  const data = await res.json()
  return data;
}

export const updateProduct = async (id: number, request: ProductPayload) => {
  const res = await fetch(`${API_URL}/api/v1/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });

  const data = await res.json();
  return data;
}