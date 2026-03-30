import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProductById, useProducts } from "@/hooks/useProduct";
import type { IProduct, IProductImage } from "@/types/product";
import ProductCard from "@/components/website/products/ProductCard";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useProductById(Number(id));
  const product = data as unknown as IProduct | undefined;

  const { data: relatedData } = useProducts();
  const related: IProduct[] = ((relatedData as any)?.data ?? []).filter(
    (p: IProduct) => p.id !== Number(id)
  );

  const images: IProductImage[] = product?.productImages ?? [];
  const [activeImage, setActiveImage] = useState<string | undefined>(undefined);
  const mainImage = activeImage ?? images[0]?.imageUrl;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse space-y-6">
        <div className="flex gap-4 h-[420px]">
          <div className="w-[20%] space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-lg" />
            ))}
          </div>
          <div className="w-[40%] bg-gray-100 rounded-2xl" />
          <div className="w-[40%] space-y-4">
            <div className="h-6 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/3" />
            <div className="h-8 bg-gray-100 rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-center text-gray-400">
        Product not found.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      {/* Top section */}
      <div className="flex gap-4">
        {/* Thumbnails — 20% */}
        <div className="w-[20%] flex flex-col gap-2 overflow-y-auto max-h-[480px]">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => setActiveImage(img.imageUrl)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                mainImage === img.imageUrl
                  ? "border-gray-800"
                  : "border-transparent"
              }`}
            >
              <img
                src={img.imageUrl}
                alt={img.fileName}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
          {images.length === 0 && (
            <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
              No images
            </div>
          )}
        </div>

        {/* Main image — 40% */}
        <div className="w-[40%] aspect-square rounded-2xl overflow-hidden bg-gray-100">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>

        {/* Product info — 40% */}
        <div className="w-[40%] space-y-4 pt-2">
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              {product.category?.name}
            </span>
            <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
          </div>

          <p className="text-3xl font-semibold text-green-600">
            ${product.price}
          </p>

          <div className="text-sm text-gray-500">
            Stock:{" "}
            <span className="font-medium text-gray-800">{product.qty}</span>
          </div>

          <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {related.slice(0, 8).map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                title={p.name}
                price={p.price}
                imageUrl={p.productImages?.[0]?.imageUrl}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
