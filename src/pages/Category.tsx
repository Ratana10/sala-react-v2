import { columns } from "@/components/categories/columns";
import { DataTable } from "@/components/data-table";
import { useCategories } from "@/hooks/useCategories";
import React from "react";

const Category = () => {
  const { data, isLoading } = useCategories();

  return (
    <div>
      <DataTable columns={columns} data={data?.data ?? []} />
    </div>
  );
};

export default Category;
