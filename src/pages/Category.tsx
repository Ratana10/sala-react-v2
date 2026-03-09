import { CategoryForm } from "@/components/categories/CategoryForm";
import { columns } from "@/components/categories/columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import type { ICategory } from "@/types/category";
import React, { useState } from "react";

const Category = () => {
  const { data, isLoading } = useCategories();

  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<ICategory | undefined>(undefined);

  const handleEdit = (category: ICategory) => {
    console.log("category", category);
    setCategory(category);
    setIsOpen(true);
  };

  const handleClose = (open: boolean) => {
    setIsOpen(open);
    setCategory(undefined);
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Create</Button>
      <DataTable
        columns={columns({ onEdit: handleEdit })}
        data={data?.data ?? []}
      />

      <CategoryForm open={isOpen} setOpen={handleClose} category={category} />
    </div>
  );
};

export default Category;
