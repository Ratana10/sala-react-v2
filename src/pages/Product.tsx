import { columns } from "@/components/products/columns";
import { DataTable } from "@/components/products/data-table";
import { useEffect, useState } from "react";

const Product = () => {
  const [products, setProducts] = useState([]);


  useEffect(() => {

    const fetchProduct = async () => {
      const res = await fetch("http://localhost:3000/api/v1/products");

      const data = await res.json();

      console.log("Fetched data", data);
      setProducts(data.data);
      return data;
    };

    fetchProduct();
  }, []);
  return (
    <div>
      <div></div>
      <div></div>
      <DataTable columns={columns} data={products} />
    </div>
  );
};

export default Product;
