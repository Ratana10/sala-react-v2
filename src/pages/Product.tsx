import { columns } from "@/components/products/columns";
import { DataTable } from "@/components/products/data-table";
import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";

const Product = () => {
  const products = [
    {
      id: 1,
      productName: "Laptop",
      price: 888.99,
      quantity: 100,
    },
    {
      id: 2,
      productName: "Phone",
      price: 888.99,
      quantity: 100,
    },
    {
      id: 3,
      productName: "Phone",
      price: 888.99,
      quantity: 100,
    },
  ];
  return (
    <div>
      <DataTable columns={columns} data={products} />
    </div>
  );
};

export default Product;
