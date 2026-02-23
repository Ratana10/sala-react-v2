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
  title: string;
  price: number;
  images: string;
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    header: "Product name",
    cell: ({ row }) => <div>{row.original.title}</div>,
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
    header: "Images",
    cell: ({ row }) => (
      <div>
        <img
          src={row.original.images[0]}
          alt=""
          className="w-[100px] h-[100px]"
        />
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
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
