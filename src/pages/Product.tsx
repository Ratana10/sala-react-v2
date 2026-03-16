import { columns } from "@/components/products/columns";
import { DataTable } from "@/components/data-table";
import ProductForm from "@/components/products/ProductForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { fetchProduct } from "@/services/product.service";
import { useQuery } from "@tanstack/react-query";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import type { IProduct } from "@/types/product";

const Product = () => {
  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>(undefined)

  const query = useQuery({
    queryKey: ["products", search],
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
    setSearch(searchInput);
  };

  const onEdit = (product: IProduct) => {
    console.log("edit product", product);
    setSelectedProduct(product)
    setOpen(true)
  };

  const onDelete = (product: IProduct) => {
    console.log("delete product", product);
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex gap-2 mb-4">
          <Input
            className="w-[200px]"
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          />
          <Button onClick={() => handleSearch()}>Search</Button>
        </div>

        <Button onClick={() => setOpen(true)}>
          <CirclePlus /> Create
        </Button>
      </div>

      <ProductForm open={open} setOpen={setOpen} product={selectedProduct} />

      <DataTable
        columns={columns({ onEdit, onDelete })}
        data={query.data.data ?? []}
      />
    </div>
  );
};

export default Product;
