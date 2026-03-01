export interface ICategory {
  id: number;
  name: string;
}

export interface CategoryResponse {
  message: string;
  data: ICategory[];
}
