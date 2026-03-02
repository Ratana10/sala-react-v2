import { useForm } from "@tanstack/react-form";
import React from "react";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCategories } from "@/hooks/useCategories";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().optional(),
  categoryId: z.number().optional(),
  qty: z.number().int().min(0, "Quantity must be 0 or more"),
});

export type ProductSchema = z.infer<typeof productSchema>;

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ProductForm = ({ open, setOpen }: Props) => {
  const { data, isLoading } = useCategories();
  console.log("Data category", data);
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
    },
  });

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Product Form</DialogTitle>
            <DialogDescription>Product Information Detail</DialogDescription>
          </DialogHeader>
          <form
            id="bug-report-form"
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
                        onChange={(e) =>
                          field.handleChange(e.target.valueAsNumber)
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
                        onChange={(e) =>
                          field.handleChange(e.target.valueAsNumber)
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
                          {data.data.map((category) => (
                            <SelectItem value={category.id}>
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
