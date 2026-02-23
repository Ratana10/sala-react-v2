import { columns } from "@/components/products/columns";
import { DataTable } from "@/components/products/data-table";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Product = () => {
  const [products, setProducts] = useState([]);


  useEffect(() => {

    const fetchProduct = async () => {
      const res = await fetch("https://api.escuelajs.co/api/v1/products");

      const data = await res.json();

      console.log("Fetched data", data);
      setProducts(data);
      return data;
    };

    fetchProduct();
  }, []);
  return (
    <div>
      <DataTable columns={columns} data={products} />
    </div>
  );
};

export default Product;
