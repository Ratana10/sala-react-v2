import { CategoryForm } from "@/components/categories/CategoryForm";
import { columns, type Category } from "@/components/categories/columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import { useState } from "react";

const CategoryPage = () => {
  const { data, isLoading } = useCategories();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedCategory(undefined);
    }
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Create</Button>
      <DataTable
        columns={columns({ onEdit: handleEdit })}
        data={data?.data ?? []}
      />

      <CategoryForm
        open={isOpen}
        setOpen={handleOpenChange}
        category={selectedCategory}
      />
    </div>
  );
};

export default CategoryPage;
