import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface Props {
  productName: string;
  productPrice: number;
  qty: number;
  imageUrl: string;
}

function ProductCard({ productName, productPrice, qty, imageUrl }: Props) {
  return (
    <Card className="w-[300px] rounded-2xl shadow-md">
      <CardContent className="space-y-4 p-4">
        <img src={imageUrl} alt="" width={250} height={250} />
        <p className="text-xl">{productName}</p>
        <p className="text-green-500">{productPrice}</p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button>View More</Button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
