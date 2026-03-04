"use client";

import type { ColumnDef } from "@tanstack/react-table";
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

export interface Category {
  id: number;
  name: string;
  createdAt: string;
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    header: "Category Name",
    cell: ({ row }) => <div>{row.original.name}</div>,
  },
  {
    header: "Created At",
    cell: ({ row }) => <div>{row.original.createdAt}</div>,
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
