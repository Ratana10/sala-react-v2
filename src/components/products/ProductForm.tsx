import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import z from "zod";

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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCategoryList } from "@/hooks/useCategories";
import { useCreateProduct, useUpdateProduct } from "@/hooks/useProduct";
import { Spinner } from "../ui/spinner";
import type { IProduct } from "@/types/product";
import type { ProductPayload } from "@/services/product.service";
import type { ICategory } from "@/types/category";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be 0 or more"),
  categoryId: z
    .union([z.number().min(1, "Category is required"), z.undefined()])
    .refine((val) => val !== undefined, {
      message: "Category is required",
    }),
  qty: z.number().int().min(0, "Quantity must be 0 or more"),
});

export type ProductSchema = z.infer<typeof productSchema>;

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  product?: IProduct | null;
}

const ProductForm = ({ open, setOpen, product }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!product;

  const { data } = useCategoryList();

  const { mutate: createProductMutate } = useCreateProduct();
  const { mutate: updateProductMutate } = useUpdateProduct();

  const form = useForm({
    defaultValues: {
      name: product?.name ?? "",
      price: product?.price ? Number(product.price) : 0,
      categoryId: product?.categoryId ?? undefined,
      qty: product?.qty ? Number(product.qty) : 0,
    },
    validators: {
      onSubmit: productSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      const payload = value as ProductPayload;

      if (isEditMode && product) {
        updateProductMutate(
          { id: product.id, request: payload },
          {
            onSuccess: () => {
              setOpen(false);
              form.reset();
            },
            onSettled: () => {
              setIsLoading(false);
            },
          },
        );
      } else {
        createProductMutate(payload, {
          onSuccess: () => {
            setOpen(false);
            form.reset();
          },
          onSettled: () => {
            setIsLoading(false);
          },
        });
      }
    },
  });

  useEffect(() => {
    if (!product) {
      form.reset();
    }
  }, [product]);

  return (
    <div>
      {isLoading && <Spinner />}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Product" : "Create Product"}
            </DialogTitle>
            <DialogDescription>Product Information Detail</DialogDescription>
          </DialogHeader>
          <form
            id="product-form"
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
                      <FieldLabel htmlFor={field.name}>Product Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter product name"
                        autoComplete="off"
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
                        type={"number"}
                        onChange={(e) =>
                          field.handleChange(e.target.valueAsNumber || 0)
                        }
                        aria-invalid={isInvalid}
                        placeholder="Enter price"
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
                      <FieldLabel htmlFor={field.name}>Quantity</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        type={"number"}
                        onChange={(e) =>
                          field.handleChange(e.target.valueAsNumber || 0)
                        }
                        aria-invalid={isInvalid}
                        placeholder="Enter quantity"
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
                        value={
                          field.state.value ? String(field.state.value) : ""
                        }
                        onValueChange={(val) => field.handleChange(Number(val))}
                      >
                        <SelectTrigger
                          id="form-tanstack-select-language"
                          aria-invalid={isInvalid}
                          className="min-w-[120px]"
                        >
                          <SelectValue placeholder="Select the category" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          {data.data.map((category: ICategory, index: number) => (
                            <SelectItem key={index} value={String(category.id)}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </form>
          <DialogFooter>
            <Field orientation="horizontal" className="flex justify-end">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button className="bg-blue-500" type="submit" form="product-form">
                Save
              </Button>
            </Field>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductForm;
