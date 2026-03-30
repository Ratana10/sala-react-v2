import { Link } from "react-router-dom";
import { Card, CardContent } from "../../ui/card";

interface Props {
  id: number;
  title: string;
  price: number;
  imageUrl?: string;
}

function ProductCard({ id, title, price, imageUrl }: Props) {
  return (
    <Link to={`/products/${id}`}>
      <Card className="overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="aspect-square bg-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}
        </div>
        <CardContent className="p-3 space-y-1">
          <p className="font-medium text-sm line-clamp-2">{title}</p>
          <p className="text-base font-semibold text-green-600">${price}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default ProductCard;
