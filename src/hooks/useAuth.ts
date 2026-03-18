import { login, type LoginPayload } from "@/services/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAuthLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ request }: { request: LoginPayload }) => login(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error: any) => {
      console.log("Failed to login", error);
    },
  });
};
