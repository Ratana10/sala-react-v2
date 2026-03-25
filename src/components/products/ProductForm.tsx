import { useForm } from "@tanstack/react-form";
import React, { useRef, useState } from "react";
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
import {
  useCreateProduct,
  useDeleteProductImage,
  useUpdateProduct,
  useUploadProductImage,
} from "@/hooks/useProduct";
import { Spinner } from "../ui/spinner";
import type { IProduct } from "@/types/product";
import { Trash2, Upload } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be 0 or more"),
  categoryId: z
    .union([z.undefined(), z.number().min(1, "Category is required")])
    .refine((value) => value !== undefined, {
      message: "Category is required",
    }),
  qty: z.number().int().min(0, "Quantity must be 0 or more"),
});

export type ProductSchema = z.infer<typeof productSchema>;

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  product?: IProduct;
}

const ProductForm = ({ open, setOpen, product }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileProgresses, setFileProgresses] = useState<Record<string, number>>(
    {},
  );
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  const { data } = useCategoryList();

  const { mutate: createProductMutate } = useCreateProduct();
  const { mutate: updateProductMutate } = useUpdateProduct();
  const { mutate: uploadProductImageMutate } = useUploadProductImage();
  const { mutate: deleteProductImageMutate } = useDeleteProductImage();

  const form = useForm({
    defaultValues: {
      name: product?.name ?? "",
      price: product?.price ? Number(product.price) : 0,
      categoryId: product?.categoryId ?? undefined,
      qty: product?.qty ?? 0,
    },
    validators: {
      onSubmit: productSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);

      if (product) {
        updateProductMutate(
          { id: product.id, request: value },
          {
            onSuccess: (res) => {
              if (res.data.id) {
                uploadedFiles.forEach((file) => {
                  uploadProductImageMutate({ id: res.data.id, request: file });
                });
              }

              deletedImageIds.forEach((id) => {
                deleteProductImageMutate(id);
              });

              setUploadedFiles([]);
              setFileProgresses({});
              setDeletedImageIds([]);

              setOpen(false);
              form.reset();
            },
            onSettled: () => {
              setIsLoading(false);
            },
          },
        );
      } else {
        createProductMutate(value, {
          onSuccess: (res) => {
            console.log("created product response", res);
            if (res.data.id) {
              uploadedFiles.forEach((file) => {
                uploadProductImageMutate({ id: res.data.id, request: file });
              });
            }

            setUploadedFiles([]);
            setFileProgresses({});
            setDeletedImageIds([]);

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

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress for each file
    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setFileProgresses((prev) => ({
          ...prev,
          [file.name]: Math.min(progress, 100),
        }));
      }, 300);
    });
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (filename: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== filename));
    setFileProgresses((prev) => {
      const newProgresses = { ...prev };
      delete newProgresses[filename];
      return newProgresses;
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      // Reset form state when dialog opens
      setUploadedFiles([]);
      setFileProgresses({});
      setDeletedImageIds([]);
    }
  };

  return (
    <div>
      {isLoading && <Spinner />}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="sm:max-w-[800px] h-[90vh]"
          key={product?.id ?? "create"}
        >
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
            key={product?.id ?? "create"}
            className="overflow-y-auto"
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

              <div className="grid grid-cols-2 gap-4">
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
                          type={"number"}
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
              </div>

               <form.Field
                name="categoryId"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldContent>
                        <FieldLabel htmlFor={field.name}>
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
                         className="w-full" 
                        >
                          <SelectValue placeholder="Select the category" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          {data?.data.map((category, index) => (
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

              <div className="">
                <div
                  className="border-2 border-dashed border-border rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer"
                  onClick={handleBoxClick}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="mb-2 bg-muted rounded-full p-3">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-pretty text-sm font-medium text-foreground">
                    Upload product image
                  </p>
                  <p className="text-pretty text-sm text-muted-foreground mt-1">
                    or,{" "}
                    <label
                      htmlFor="fileUpload"
                      className="text-primary hover:text-primary/90 font-medium cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      click to browse
                    </label>{" "}
                    (4MB max)
                  </p>
                  <input
                    type="file"
                    id="fileUpload"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files)}
                  />
                </div>
              </div>

              {/* Display existing product images */}
              {product?.productImages && product.productImages.length > 0 && (
                <div className="">
                  <p className="text-sm font-medium text-foreground mb-3">
                    Existing Images
                  </p>
                  <div className="space-y-3">
                    {product.productImages
                      .filter((img) => !deletedImageIds.includes(img.id))
                      .map((image) => (
                        <div
                          className="border border-border rounded-lg p-2 flex flex-col"
                          key={image.id}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-18 h-14 bg-muted rounded-sm flex items-center justify-center self-start overflow-hidden">
                              <img
                                src={image.imageUrl}
                                alt={image.fileName}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex-1 pr-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-foreground truncate max-w-[250px]">
                                  {image.fileName}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="bg-transparent! hover:text-red-500"
                                  onClick={() =>
                                    setDeletedImageIds((prev) => [
                                      ...prev,
                                      image.id,
                                    ])
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Uploaded on{" "}
                                {new Date(image.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {uploadedFiles.map((file, index) => {
                  const imageUrl = URL.createObjectURL(file);

                  return (
                    <div
                      className="border border-border rounded-lg p-2 flex flex-col"
                      key={file.name + index}
                      onLoad={() => {
                        return () => URL.revokeObjectURL(imageUrl);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-18 h-14 bg-muted rounded-sm flex items-center justify-center self-start row-span-2 overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 pr-1">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-foreground truncate max-w-[250px]">
                                {file.name}
                              </span>
                              <span className="text-sm text-muted-foreground whitespace-nowrap">
                                {Math.round(file.size / 1024)} KB
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="bg-transparent! hover:text-red-500"
                              onClick={() => removeFile(file.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="h-2 bg-muted rounded-full overflow-hidden flex-1">
                              <div
                                className="h-full bg-primary"
                                style={{
                                  width: `${fileProgresses[file.name] || 0}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {Math.round(fileProgresses[file.name] || 0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
