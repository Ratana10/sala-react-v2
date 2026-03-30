import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Product from "./pages/admin/Product";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import User from "./pages/admin/User";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Category from "./pages/admin/Category";
import { Toaster } from "./components/ui/sonner";
import LoginPage from "./pages/admin/LoginPage";
import WebsiteLayout from "./layouts/WebsiteLayout";
import ProductPage from "./pages/ProductPage";
import ProductDetailPage from "./pages/ProductDetailPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<WebsiteLayout />}>
            <Route path="/products" element={<ProductPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<DashboardLayout />}>
            <Route path="/admin/products" element={<Product />} />
            <Route path="/admin/users" element={<User />} />
            <Route path="/admin/categories" element={<Category />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}

export default App;
