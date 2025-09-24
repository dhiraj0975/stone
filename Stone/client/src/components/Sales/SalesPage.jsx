import React from "react";
import { Outlet } from "react-router-dom";

// Optional wrapper for all sales-related pages
const SalesPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sales Module</h1>
      
      {/* Render child route components */}
      <Outlet />
    </div>
  );
};

export default SalesPage;
