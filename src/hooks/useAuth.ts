import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/services/auth.service";
import { tokenStorage } from "@/utils/token";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["login"] });
    },
    onError: (error) => {
      console.error("Failed to login:", error);
    },
  });
};

export function useLogout() {
  const navigate = useNavigate();

  return () => {
    tokenStorage.remove();
    navigate("/login");
  };
}
