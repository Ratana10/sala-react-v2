"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  CreditCard,
  QrCode,
} from "lucide-react";
import { useProducts } from "@/hooks/useProduct";
import type { IProduct } from "@/types/product";
import { useCategories } from "@/hooks/useCategories";
import type { ICategory } from "@/types/category";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
}


const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Duck Salad",
    category: "Pizza",
    price: 35.0,
    image: "/placeholder.svg?height=200&width=300"
  },
  {
    id: "2",
    name: "Breakfast board",
    category: "Taco",
    price: 14.0,
    image: "/placeholder.svg?height=200&width=300"
  },
  {
    id: "3",
    name: "Hummus",
    category: "Sandwich",
    price: 24.0,
    image: "/placeholder.svg?height=200&width=300"
  },
  {
    id: "4",
    name: "Roast beef",
    category: "Kebab",
    price: 17.5,
    image: "/placeholder.svg?height=200&width=300"
  },
  {
    id: "5",
    name: "Tuna salad",
    category: "Popcorn",
    price: 35.0,
    image: "/placeholder.svg?height=200&width=300"
  },
  {
    id: "6",
    name: "Salmon",
    category: "Burger",
    price: 48.0,
    image: "/placeholder.svg?height=200&width=300"
  },
  {
    id: "7",
    name: "California roll",
    category: "Taco",
    price: 74.0,
    image: "/placeholder.svg?height=200&width=300"
  },
  {
    id: "8",
    name: "Sashimi",
    category: "Burrito",
    price: 74.0,
    image: "/placeholder.svg?height=200&width=300"
  }
];

export default function PosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { ...menuItems[3], quantity: 1, price: 12.0 },
    { ...menuItems[4], quantity: 1, price: 14.0 },
    { ...menuItems[5], quantity: 1, price: 45.0 },
    { ...menuItems[6], quantity: 1, price: 22.0 },
    {
      id: "9",
      name: "Duck carpaccio",
      category: "Special",
      price: 18.0,
      image: "",
      quantity: 1,
    },
  ]);
  const [draftNumber, setDraftNumber] = useState(1);

  const { data: productData } = useProducts();
  const { data: categoryData } = useCategories();

  const products = (productData?.data as IProduct[]) ?? [];
  const categories = (categoryData?.data as ICategory[]) ?? [];
  console.log("products", products);

  const addToOrder = (item: MenuItem) => {
    const existingItem = orderItems.find(
      (orderItem) => orderItem.id === item.id,
    );
    if (existingItem) {
      setOrderItems(
        orderItems.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem,
        ),
      );
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromOrder = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromOrder(id);
    } else {
      setOrderItems(
        orderItems.map((item) =>
          item.id === id ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Categories</h1>
            <div className="flex items-center gap-2">
              <ChevronLeft className="text-muted-foreground h-5 w-5" />
              <ChevronRight className="text-muted-foreground h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="border-b p-4">
          <div className="flex gap-4 overflow-x-auto">
            {categories.map((category, index) => (
              <div
                key={index}
                className="hover:bg-muted flex min-w-[80px] cursor-pointer flex-col items-center rounded-lg p-2 bg-orange-100"
                onClick={() => setSelectedCategory(category.name)}
              >
                <span className=" text-center text-[18px]  px-2 py-1">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {products.map((item: IProduct) => (
              <Card
                key={item.id}
                className="cursor-pointer transition-shadow hover:shadow-lg p-0"
                // onClick={() => addToOrder(item)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={item.productImages?.[0]?.imageUrl ?? "/no-image.png"}
                      alt={item.name}
                      className="object-fill w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 font-semibold">{item.name}</h3>
                    <p className="text-muted-foreground mb-2 text-sm">
                      {/* {item?.category?.name} */}
                      {item?.category?.name}
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      ${item.price}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Order Summary */}
      <div className="flex w-80 flex-col border-l">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">
              Draft #{draftNumber.toString().padStart(3, "0")}
            </h2>
            <div className="flex items-center gap-2">
              <Plus className="text-muted-foreground h-4 w-4" />
              <Trash2 className="text-muted-foreground h-4 w-4" />
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {orderItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex items-center gap-3"
              >
                <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-lg">
                  <span className="text-lg">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{item.name}</h4>
                  <p className="text-muted-foreground text-xs">
                    {item.description || "Lorem ipsum dolor sit"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)}$</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>{tax.toFixed(2)}$</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{total.toFixed(2)}$</span>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              className="flex h-auto flex-col items-center bg-transparent p-4"
            >
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                <span className="font-semibold text-green-600">$</span>
              </div>
              <span className="text-xs">Cash</span>
            </Button>
            <Button
              variant="outline"
              className="flex h-auto flex-col items-center bg-transparent p-4"
            >
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                <CreditCard className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-xs">Debit</span>
            </Button>
            <Button
              variant="outline"
              className="flex h-auto flex-col items-center bg-transparent p-4"
            >
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                <QrCode className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-xs">Scan</span>
            </Button>
          </div>

          <Button className="w-full bg-blue-600 py-3 text-white hover:bg-blue-700">
            Checkout ${total.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
}
