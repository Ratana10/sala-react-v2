import { columns } from "@/components/products/columns";
import { DataTable } from "@/components/data-table";
import ProductForm from "@/components/products/ProductForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import { fetchProduct } from "@/services/product.service";
import { useQuery } from "@tanstack/react-query";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import type { IProduct } from "@/types/product";

const ITEMS_PER_PAGE = 10;

const Product = () => {
  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>(
    undefined,
  );

  const query = useQuery({
    queryKey: ["products", search, page],
    queryFn: () => fetchProduct(searchInput, page),
  });

  const pagination = query.data?.pagination;
  const totalPages = Math.ceil(pagination?.total / pagination?.limit);

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
    setSelectedProduct(product);
    setOpen(true);
  };

  const onDelete = (product: IProduct) => {
    console.log("delete product", product);
  };

  const getPageNumbers = (
    currentPage: number,
    totalPages: number,
  ): (number | "ellipsis")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [];

    pages.push(1);

    if (currentPage > 3) pages.push("ellipsis");

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("ellipsis");

    pages.push(totalPages);

    return pages;
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

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(pagination.currentPage - 1)}
            />
          </PaginationItem>
          {getPageNumbers(pagination.currentPage, totalPages).map(
            (pageNum, idx) =>
              pageNum === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => setPage(pageNum)}
                    isActive={pagination.currentPage === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ),
          )}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(pagination.currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Product;
