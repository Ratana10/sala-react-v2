import { columns } from "@/components/products/columns";
import { DataTable } from "@/components/products/data-table";
import { fetchProduct } from "@/services/product";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const Product = () => {
  const query = useQuery({ queryKey: ["product"], queryFn: fetchProduct });

  console.log("query", query.data);
  // useEffect(() => {
  //   fetchProduct();
  // }, []);
  return (
    <div>
      <DataTable columns={columns} data={query.data ?? []} />
    </div>
  );
};

export default Product;
