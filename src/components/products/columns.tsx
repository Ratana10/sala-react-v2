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

export interface Product {
  id: number;
  name: string;
  price: number;
  qty: string;
  categoryId: number;
  isActive: boolean;
  category: {
    id: number;
    name: string;
  };
}

export const columns: ColumnDef<Product>[] = [
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
        <Badge className="bg-blue-500">{row.original.category.name}</Badge>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      console.log('row', row)
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
            <DropdownMenuItem>
              <SquarePen /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
              <Trash2 className="text-red-500" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
