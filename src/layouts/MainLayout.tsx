import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <p className="text-center">Header</p>
      <Outlet />
      <p className="text-center">Footer</p>
    </div>
  );
};

export default MainLayout;
