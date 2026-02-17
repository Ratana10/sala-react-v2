import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />}></Route>
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="/products" element={<Product />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
