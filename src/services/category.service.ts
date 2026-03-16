const API_URL = import.meta.env.VITE_API_URL;

export const getCategories = async (search?: string) => {
  const res = await fetch(
    `${API_URL}/api/v1/categories?search=${search}`,
  );

  const data = await res.json();

  console.log("Fetched data", data);
  return data;
};

export const getCategoryList = async () => {
  const res = await fetch(`${API_URL}/api/v1/categories/list`);

  const data = await res.json();

  return data;
};

export const createCategory = async (request: any) => {
  const res = await fetch(`${API_URL}/api/v1/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data = await res.json();

  console.log("Fetched data", data);
  return data;
};

export const updateCategory = async (id: number, request: any) => {
  const res = await fetch(`${API_URL}/api/v1/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data = await res.json();
  return data;
};

export const deleteCategory = async (id?: number) => {
  const res = await fetch(`${API_URL}/api/v1/categories/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return data;
};
