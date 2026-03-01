import type { CategoryResponse } from "@/types/category";
import { api } from "./api";

export const getCategories = async () => {
  const { data } = await api.get<CategoryResponse>("/api/v1/categories");

  return data;
};
