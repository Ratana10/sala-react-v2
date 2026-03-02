import { Navigate, Outlet } from "react-router-dom";
import { tokenStorage } from "@/utils/token";

export default function ProtectedRoute() {
  const token = tokenStorage.get();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
