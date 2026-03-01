import type { LoginSchema } from "@/schema/LoginSchema";
import { api } from "./api";

export const login = async (request: LoginSchema) => {
  const { data } = await api.post(`/api/v1/auth/login`, request);

  return data;
};
