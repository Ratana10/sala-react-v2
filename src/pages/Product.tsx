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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts } from "@/hooks/useProduct";
import { getAcessToken } from "@/utils/tokenStorage";
import { useNavigate } from "react-router-dom";
import FileUpload01 from "@/components/file-upload-01";

const Product = () => {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>(
    undefined,
  );

  const { data: productData, isLoading } = useProducts(search, page, limit);

  const pagination = productData?.pagination;
  const totalPages = Math.ceil(
    (pagination?.total || 0) / (pagination?.limit || 1),
  );
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  console.log("pagination", pagination);
  if (isLoading) {
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
    setSelectedProduct(product);
    setOpen(true);
  };

  const onDelete = (product: IProduct) => {
    console.log("delete product", product);
  };

  const accessToken = getAcessToken();
  if (!accessToken) {
    navigate("/login");
  }
  
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
        data={productData?.data ?? []}
      />

      <div className="flex justify-between mt-4">
        <div className="flex w-full items-center gap-2">
          <p>Rows per page</p>

          <Select
            defaultValue="10"
            onValueChange={(value) => setLimit(Number(value))}
          >
            <SelectTrigger className="w-20" id="select-rows-per-page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Pagination className="flex justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(pagination?.prevPage)}
              />
            </PaginationItem>
            {pages.map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={p === pagination?.currentPage}
                  onClick={() => setPage(p)}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext onClick={() => setPage(pagination?.nextPage)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Product;
