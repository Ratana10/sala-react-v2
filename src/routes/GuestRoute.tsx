import { Navigate, Outlet } from "react-router-dom";
import { tokenStorage } from "@/utils/token";

export default function GuestRoute() {
  const token = tokenStorage.get();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}