import { columns } from "@/components/products/columns";
import { DataTable } from "@/components/products/data-table";
import { ProductForm } from "@/components/products/ProductForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { fetchProduct } from "@/services/product.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Product = () => {
  const [searchInput, setSearchInput] = useState("");

  const [open, setOpen] = useState(false);

  const query = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProduct(searchInput),
  });

  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const handleSearch = () => {
    console.log("search input", searchInput);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Input
          className="w-[200px]"
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button onClick={() => handleSearch()}>Search</Button>
      </div>
      <div className="flex justify-end items-end mb-2">
        <Button onClick={() => setOpen(true)}>Add More</Button>
      </div>
      <ProductForm open={open} setOpen={setOpen} />

      <DataTable columns={columns} data={query.data.data ?? []} />
    </div>
  );
};

export default Product;
