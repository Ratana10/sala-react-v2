
export const fetchProduct = async () => {
  const res = await fetch("https://api.escuelajs.co/api/v1/products");

  const data = await res.json();

  console.log("Fetched data", data);
  return data;
};
