export const fetchProduct = async (search?: string) => {
  const res = await fetch(`http://localhost:3000/api/v1/products?search=${search}`);

  const data = await res.json();

  console.log("Fetched data", data);
  return data;
};