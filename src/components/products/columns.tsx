"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import type { IProduct } from "@/types/product";

interface ColumnActions {
  onEdit?: (product: IProduct) => void;
  onDelete?: (product: IProduct) => void;
}

export const columns = (actions?: ColumnActions): ColumnDef<IProduct>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    header: "Product name",
    cell: ({ row }) => <div>{row.original.name}</div>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div>
        <Badge className="bg-blue-500">{row.original.price}</Badge>
      </div>
    ),
  },
  {
    header: "Qty",
    cell: ({ row }) => <div>{row.original.qty}</div>,
  },
  {
    header: "Category",
    cell: ({ row }) => (
      <div>
        <Badge className="bg-blue-500">{row.original.category?.name}</Badge>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => actions?.onEdit?.(product)}>
              <SquarePen /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => actions?.onDelete?.(product)}
            >
              <Trash2 className="text-red-500" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
