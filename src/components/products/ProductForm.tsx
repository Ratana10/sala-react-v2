"use client";
import { useState, useRef } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCategories } from "@/hooks/useCategories";
import type { ICategory } from "@/types/category";
import { useCreateProduct, useUploadProduct } from "@/hooks/useProduct";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number(),
  categoryId: z.number(),
  qty: z.number().int().min(0, "Quantity must be 0 or more"),
});

export type ProductSchema = z.infer<typeof productSchema>;

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function ProductForm({ open, setOpen }: Props) {
  const { data } = useCategories();
  console.log("fetched category", data);
  const categories = data?.data ?? [];

  const { mutate: createProduct, isPending } = useCreateProduct();
  const { mutate: uploadProductImage, isPending: isUploading } =
    useUploadProduct();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      price: 0,
      categoryId: 0,
      qty: 0,
    },
    validators: {
      onSubmit: productSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("value", value);
      createProduct(value, {
        onSuccess: (data) => {
          const productId = data.id ?? data.data?.id;
          if (productId && selectedFile) {
            uploadProductImage(
              { productId, file: selectedFile },
              {
                onSuccess: () => {
                  setOpen(false);
                  form.reset();
                  setSelectedFile(null);
                  setPreviewUrl(null);
                },
              }
            );
          } else {
            setOpen(false);
            form.reset();
            setSelectedFile(null);
            setPreviewUrl(null);
          }
        },
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Product Form</DialogTitle>
          <DialogDescription>Product Information Detail</DialogDescription>
        </DialogHeader>
        <form
          id="product-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="gap-2 p-0">
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="price"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.valueAsNumber)
                      }
                      aria-invalid={isInvalid}
                      type={"number"}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="qty"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Qty</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.valueAsNumber)
                      }
                      aria-invalid={isInvalid}
                      type={"number"}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="categoryId"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation="responsive" data-invalid={isInvalid}>
                    <FieldContent>
                      <FieldLabel htmlFor="form-tanstack-select-language">
                        Category
                      </FieldLabel>

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldContent>
                    <Select
                      name={field.name}
                      value={String(field.state.value)}
                      onValueChange={(val) => field.handleChange(Number(val))}
                    >
                      <SelectTrigger
                        id="form-tanstack-select-language"
                        aria-invalid={isInvalid}
                        className="min-w-[120px]"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {categories.map((category: ICategory) => (
                          <SelectItem
                            key={category.id}
                            value={String(category.id)}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                );
              }}
            />
            <Field>
              <FieldLabel htmlFor="image">Image</FieldLabel>
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  disabled={isPending || isUploading}
                />
                {selectedFile && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveFile}
                    disabled={isPending || isUploading}
                  >
                    Remove
                  </Button>
                )}
              </div>
              {previewUrl && (
                <div className="mt-2">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-24 w-24 object-cover rounded-md"
                  />
                </div>
              )}
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Field orientation="horizontal" className="flex justify-end">
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending || isUploading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-blue-500"
              type="submit"
              form="product-form"
              disabled={isPending || isUploading}
            >
              {isPending || isUploading ? "Saving..." : "Save"}
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
