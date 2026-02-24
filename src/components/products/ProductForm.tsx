"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { createProduct } from "@/services/product";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0, "Price must be 0 or greater"),
  qty: z.coerce.number().min(0, "Price must be 0 or greater"),
});

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}
export default function ProductForm({ open, setOpen }: Props) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", price: 0, qty: 0 },
  });

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("Product created!");
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to create product.");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" placeholder="" {...form.register("name")} />

                <FieldError>{form.formState.errors.name?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="price">Price</FieldLabel>
                <Input id="price" placeholder="" {...form.register("price")} />

                <FieldError>{form.formState.errors.price?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="qty">Qty</FieldLabel>
                <Input id="qty" placeholder="" {...form.register("qty")} />

                <FieldError>{form.formState.errors.qty?.message}</FieldError>
              </Field>
              <div className="flex justify-end">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
