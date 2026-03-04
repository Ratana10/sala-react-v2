import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import User from "./pages/User";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Category from "./pages/Category";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />}></Route>
          </Route>

          <Route element={<DashboardLayout />}>
            <Route path="/products" element={<Product />} />
            <Route path="/users" element={<User />} />
            <Route path="/categories" element={<Category />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
