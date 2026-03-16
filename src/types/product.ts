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
}