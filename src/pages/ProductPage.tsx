import ProductCard from "@/components/website/products/ProductCard";
import { useProducts } from "@/hooks/useProduct";
import type { IProduct } from "@/types/product";

const ProductPage = () => {
  const { data, isLoading } = useProducts();
  const products: IProduct[] = (data as any)?.data ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-gray-100 animate-pulse aspect-square"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.name}
              price={product.price}
              imageUrl={product.productImages?.[0]?.imageUrl}
            />
          ))}
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <p className="text-center text-gray-400 mt-16">No products found.</p>
      )}
    </div>
  );
};

export default ProductPage;
