import { CategoryForm } from "@/components/categories/CategoryForm";
import { columns } from "@/components/categories/columns";
import ConfirmDelete from "@/components/categories/ConfirmDelete";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategories, useDeleteCategory } from "@/hooks/useCategories";
import type { ICategory } from "@/types/category";
import React, { useState } from "react";
import { toast } from "sonner";
import { useDebounce } from 'use-debounce';

const Category = () => {
  
  const { mutate: deleteCategoryMutate } = useDeleteCategory();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  
  
  const [value] = useDebounce(searchInput, 500) // 0.5s
  
  const { data, isLoading } = useCategories(value);
  console.log('value', value)

  const [category, setCategory] = useState<ICategory | undefined>(undefined);

  const onEdit = (category: ICategory) => {
    setCategory(category);
    setIsOpen(true);
  };

  const onDelete = (category: ICategory) => {
    setCategory(category);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    deleteCategoryMutate(
      { id: category?.id },
      {
        onSuccess: () => {
          toast.success("Category deleted successfully");
        },
      },
    );
  };

  const handleClose = (open: boolean) => {
    setIsOpen(open);
    setCategory(undefined);
  };

  return (
    <div>
      <div className="flex justify-between gap-5 mb-4">
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-[400px]"
          placeholder="Search by name"
        />
        <Button onClick={() => setIsOpen(true)}>Create</Button>
      </div>

      <DataTable
        columns={columns({ onEdit, onDelete })}
        data={data?.data ?? []}
      />

      <CategoryForm open={isOpen} setOpen={handleClose} category={category} />

      <ConfirmDelete
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        category={category}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

export default Category;
