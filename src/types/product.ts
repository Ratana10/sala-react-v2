export interface IProduct {
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
  productImages?: IProductImage[]
}

export interface IProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  fileName: string;
}