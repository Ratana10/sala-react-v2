import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, Plus, Minus, Trash2, CreditCard, QrCode } from "lucide-react";
import { useProducts } from "@/hooks/useProduct";
import { useCategoryList } from "@/hooks/useCategories";
import type { ICategory } from "@/types/category";
import type { IProduct } from "@/types/product";
import type { ICart } from "@/types/cart";
import { useCreateOrder, useGeneratePdf } from "@/hooks/useOrder";
import SharedDialog from "../SharedDialog";
import { useCreatePayment } from "@/hooks/usePayment";

export default function PosClient() {
  const [search, setSearch] = useState("");
  const [page] = useState(1);
  const [limit] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [draftNumber] = useState(1);
  const [orderItems, setOrderItems] = useState<ICart[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [createdOrderId, setCreatedOrderId] = useState<number | undefined>(
    undefined,
  );

  const { data: productData, isLoading: isProductLoading } = useProducts(
    search,
    page,
    limit,
  );

  const { data: categoryData, isLoading: isCategoryLoading } =
    useCategoryList();

  const categories: ICategory[] = categoryData?.data || [];
  const products: IProduct[] = productData?.data || [];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory =
        selectedCategory === "All" ||
        product.category?.name === selectedCategory;

      const matchSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, search]);

  const addToOrder = (product: IProduct) => {
    if (product.qty <= 0) return;

    setOrderItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        if (existingItem.quantity >= existingItem.stock) {
          return prev;
        }

        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          category: product.category?.name || "Uncategorized",
          price: Number(product.price),
          image: product.productImages?.[0]?.imageUrl || "/placeholder.svg",
          stock: product.qty,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromOrder = (id: number) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    setOrderItems((prev) =>
      prev.flatMap((item) => {
        if (item.id !== id) return [item];
        if (quantity <= 0) return [];
        if (quantity > item.stock) return [{ ...item, quantity: item.stock }];
        return [{ ...item, quantity }];
      }),
    );
  };

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const { mutate: createOrderMutate } = useCreateOrder();
  const { mutate: createPaymentMutate } = useCreatePayment();

  const { data: generatedPdf } = useGeneratePdf(createdOrderId);

  const pdfUrl = useMemo(() => {
    if (!generatedPdf) return null;
    return URL.createObjectURL(generatedPdf as Blob);
  }, [generatedPdf]);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const handlePlaceOrder = () => {
    setIsLoading(true);

    const orderData = {
      orderNumber: `INV-${Date.now()}`,
      customerId: 3,
      location: "Phnom Penh",
      discount: 0,
      items: orderItems.map((item) => ({
        productId: item.id,
        qty: item.quantity,
      })),
    };
    createOrderMutate(orderData, {
      onSuccess: (res) => {
        console.log("res", res);
        // if (res.data && res.data?.id) {
        //   setCreatedOrderId(res.data.id);
        // }
        if (res.data && res.data?.id) {
          const payload = {
            method: "ABA_PAYWAY",
          };
          createPaymentMutate(
            { orderId: Number(res.data.id), request: payload },
            {
              onSuccess: (res) => {
                console.log("res", res.data);
                if (res.data) {
                  const payment = res.data?.payway;

                  // Remove any previous form
                  document.getElementById("aba_merchant_request")?.remove();

                  const form = document.createElement("form");
                  form.id = "aba_merchant_request";
                  form.method = payment.method;
                  form.action = payment.action;
                  form.target = payment.target;
                  Object.entries(payment.fields).forEach(([key, value]) => {
                    const input = document.createElement("input");
                    input.type = "hidden";
                    input.name = key;
                    input.value = String(value);
                    form.appendChild(input);
                  });

                  document.body.appendChild(form);

                  // const AbaPayway = (window as any).AbaPayway;
                  // if (!AbaPayway) {
                  //   console.error("AbaPayway SDK not loaded. Falling back to redirect.");
                  //   form.submit();
                  //   return;
                  // }
                  AbaPayway?.checkout();
                }
              },
              onSettled: () => {
                setIsLoading(false);
              },
            },
          );
        }
      },
    });
  };

  return (
    <div>
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          {/* Search */}
          <div className="border-b p-4">
            <div className="relative max-w-md">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="pl-9"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="border-b p-4">
            <div className="flex gap-4 overflow-x-auto">
              <div
                className={`flex min-w-[90px] cursor-pointer flex-col items-center rounded-lg p-2 ${
                  selectedCategory === "All" ? "bg-muted" : "hover:bg-muted"
                }`}
                onClick={() => setSelectedCategory("All")}
              >
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-2xl">
                  🛍️
                </div>
                <span className="text-muted-foreground text-center text-xs">
                  All
                </span>
              </div>

              {!isCategoryLoading &&
                categories.map((category) => (
                  <div
                    key={category.id}
                    className={`flex min-w-[90px] cursor-pointer flex-col items-center rounded-lg p-2 ${
                      selectedCategory === category.name
                        ? "bg-muted"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-2xl">
                      📦
                    </div>
                    <span className="text-muted-foreground text-center text-xs">
                      {category.name}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-auto p-6">
            {isProductLoading ? (
              <div className="text-muted-foreground flex h-full items-center justify-center">
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-muted-foreground flex h-full items-center justify-center">
                No products found
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                {filteredProducts.map((product) => {
                  const image =
                    product.productImages?.[0]?.imageUrl || "/placeholder.svg";
                  const outOfStock = product.qty <= 0;

                  return (
                    <Card
                      key={product.id}
                      className={`transition-shadow ${
                        outOfStock
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer hover:shadow-lg"
                      }`}
                      onClick={() => !outOfStock && addToOrder(product)}
                    >
                      <CardContent className="p-0">
                        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
                          <img
                            src={image}
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                          {outOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-semibold text-white">
                              Out of stock
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <h3 className="mb-1 line-clamp-1 font-semibold">
                            {product.name}
                          </h3>
                          <p className="text-muted-foreground mb-2 text-sm">
                            {product.category?.name || "Uncategorized"}
                          </p>

                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-lg font-bold text-blue-600">
                              ${Number(product.price).toFixed(2)}
                            </p>
                            <span className="text-muted-foreground text-xs">
                              Stock: {product.qty}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Order Summary */}
        <div className="flex w-80 flex-col border-l">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">
                Draft #{draftNumber.toString().padStart(3, "0")}
              </h2>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOrderItems([])}
                disabled={orderItems.length === 0}
              >
                <Trash2 className="text-muted-foreground h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            {orderItems.length === 0 ? (
              <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                No item in cart
              </div>
            ) : (
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="bg-muted h-12 w-12 overflow-hidden rounded-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{item.name}</h4>
                      <p className="text-muted-foreground text-xs">
                        {item.category}
                      </p>
                      <p className="text-xs text-blue-600">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <p className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <span className="min-w-6 text-center text-sm">
                          {item.quantity}
                        </span>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => removeFromOrder(item.id)}
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

            <Button
              className="w-full bg-blue-600 py-3 text-white hover:bg-blue-700"
              disabled={orderItems.length === 0}
              onClick={() => setIsCheckoutOpen(true)}
            >
              Checkout ${total.toFixed(2)}
            </Button>
          </div>
        </div>
      </div>

      <SharedDialog
        open={isCheckoutOpen}
        setOpen={setIsCheckoutOpen}
        title="Order Preview"
      >
        <div className="space-y-4">
          {/* Item list */}
          <div className="space-y-2">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-8 w-8 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground text-xs">
                      x{item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-1">
              <span>Total</span>
              <span className="text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Confirm button */}
          <Button
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            onClick={handlePlaceOrder}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : `Confirm & Pay $${total.toFixed(2)}`}
          </Button>
        </div>
      </SharedDialog>

      <SharedDialog
        open={!!pdfUrl}
        setOpen={(open) => {
          if (!open) {
            setCreatedOrderId(0);
            setOrderItems([]);
          }
        }}
        title="Order Receipt"
        width="80%"
        height="90%"
      >
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="h-full w-full rounded-lg border"
            title="Order Receipt"
          />
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            Generating receipt...
          </div>
        )}
      </SharedDialog>
    </div>
  );
}
