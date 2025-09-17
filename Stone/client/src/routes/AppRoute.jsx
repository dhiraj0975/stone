// src/routes/AppRoute.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";


// Pages & Components
import Login from "../pages/auth/Login";
import Dashboard from "../components/Dashboard/Dashboard";
import VendorPage from "../components/vendors/VendorPage";
import PrivateRoute from '../components/PrivateRoute'
import Spinner from "../components/Spinner";
import DashboardLayout from "../components/Dashboard/DashboardLayout";
//import PurchaseOrder from "../components/Sidebar/PurchaseOrder";
import Product from "../components/Sidebar/Product";
import ProductionEntryForm from "../components/Sidebar/ProductionEntryForm";
import Categories from "../components/Categories/Categories";
import Purchases from "../components/purchase/Purchases";
import PurchaseOrders from "../components/PurchaseOrder/PurchaseOrders";

const AppRoute = () => {
  const { loading } = useSelector((state) => state.alerts);

  return (
    <BrowserRouter>
      {loading && <Spinner />}
      <Routes>
        {/* 🔒 Protected routes (with sidebar layout) */}
     
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vendor" element={<VendorPage />} />
            <Route path="/category" element={<Categories />} />
            <Route path="/bom" element={<h1>BOM</h1>} />
            <Route path="/production" element={<ProductionEntryForm />} />
            <Route path="/inventory" element={<h1>Inventory</h1>} />
            <Route path="/invoicing" element={<h1>Invoicing</h1>} />
            <Route path="/product" element={<Product />} />
             <Route path="/purchases" element={<Purchases/>} />
             <Route path="/purchase-orders" element={<PurchaseOrders/>} />
          </Route>
        
        {/* 🌐 Public routes (no layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />

        {/* 🚫 Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoute;
