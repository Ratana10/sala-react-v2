"use client";
import * as React from "react";
import { useForm } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateCategory, useUpdateCategory } from "@/hooks/useCategories";
import { toast } from "sonner";
import type { ICategory } from "@/types/category";
import { CategorySchema } from "@/schemas/category";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  category?: ICategory;
}

export function CategoryForm({ open, setOpen, category }: Props) {
  const { mutate: createCategoryMutate } = useCreateCategory();
  const { mutate: updateCategoryMutate } = useUpdateCategory();
  const form = useForm({
    defaultValues: {
      name: category?.name ?? "",
    },
    validators: {
      onSubmit: CategorySchema,
    },
    onSubmit: async ({ value }) => {
      if (category?.id) {
        updateCategoryMutate(
          { id: category.id, request: value },
          {
            onSuccess: () => {
              toast.success("Category updated successfully");
              setOpen(false);
              form.reset();
            },
          },
        );
        return;
      }
      createCategoryMutate(value, {
        onSuccess: () => {
          toast.success("Category created successfully");
          setOpen(false);
          form.reset();
        },
      });
    },
  });

  React.useEffect(() => {
    if (category) {
      form.setFieldValue("name", category.name);
    } else {
      form.reset();
    }
  }, [category]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Create Category"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Update the category details below."
              : "Enter the details for the new category."}
          </DialogDescription>
        </DialogHeader>
        <form
          id="category-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Category Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter category name"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="category-form">
            {category ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    // <Card className="w-full sm:max-w-md">
    //   <CardHeader>
    //     <CardTitle>Category</CardTitle>
    //     <CardDescription>
    //       Category information detail
    //     </CardDescription>
    //   </CardHeader>
    //   <CardContent>
    //     <form
    //       id="bug-report-form"
    //       onSubmit={(e) => {
    //         e.preventDefault()
    //         form.handleSubmit()
    //       }}
    //     >
    //       <FieldGroup>
    //         <form.Field
    //           name="name"
    //           children={(field) => {
    //             const isInvalid =
    //               field.state.meta.isTouched && !field.state.meta.isValid
    //             return (
    //               <Field data-invalid={isInvalid}>
    //                 <FieldLabel htmlFor={field.name}>Category Name</FieldLabel>
    //                 <Input
    //                   id={field.name}
    //                   name={field.name}
    //                   value={field.state.value}
    //                   onBlur={field.handleBlur}
    //                   onChange={(e) => field.handleChange(e.target.value)}
    //                   aria-invalid={isInvalid}
    //                   placeholder="Enter category name"
    //                   autoComplete="off"
    //                 />
    //                 {isInvalid && (
    //                   <FieldError errors={field.state.meta.errors} />
    //                 )}
    //               </Field>
    //             )
    //           }}
    //         />

    //       </FieldGroup>
    //     </form>
    //   </CardContent>
    //   <CardFooter>
    //     <Field orientation="horizontal">
    //       <Button type="button" variant="outline" onClick={() => form.reset()}>
    //         Reset
    //       </Button>
    //       <Button type="submit" form="bug-report-form">
    //         Submit
    //       </Button>
    //     </Field>
    //   </CardFooter>
    // </Card>
  );
}
