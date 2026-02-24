import { columns } from "@/components/products/columns";
import { DataTable } from "@/components/products/data-table";
import ProductForm from "@/components/products/ProductForm";
import { Button } from "@/components/ui/button";
import { fetchProduct } from "@/services/product";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

const Product = () => {
  const [open, setOpen] = useState(false);

  const query = useQuery({ queryKey: ["product"], queryFn: fetchProduct });

  console.log("query", query.data);

  return (
    <div>
      <Button size="sm" onClick={() => setOpen(true)}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Product
      </Button>
      <ProductForm open={open} setOpen={setOpen} />

      <DataTable columns={columns} data={query.data ?? []} />
    </div>
  );
};

export default Product;
