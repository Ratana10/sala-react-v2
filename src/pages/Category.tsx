import { CategoryForm } from "@/components/categories/CategoryForm";
import { columns } from "@/components/categories/columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import React, { useState } from "react";

const Category = () => {
  const { data, isLoading } = useCategories();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={()=> setIsOpen(true)}>Create</Button>
      <DataTable columns={columns} data={data?.data ?? []} />

      <CategoryForm open={isOpen} setOpen={setIsOpen} />
    </div>
  );
};

export default Category;
