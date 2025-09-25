// src/routes/AppRoute.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Pages & Components
import Login from "../pages/auth/Login";
import Dashboard from "../components/Dashboard/Dashboard";
import VendorPage from "../components/vendors/VendorPage";
import Spinner from "../components/Spinner";
import DashboardLayout from "../components/Dashboard/DashboardLayout";
import Product from "../components/Sidebar/Product";
import ProductionEntryForm from "../components/Sidebar/ProductionEntryForm";
import Categories from "../components/Categories/Categories";
import Purchases from "../components/purchase/Purchases";
import PurchaseOrders from "../components/PurchaseOrder/PurchaseOrders";
import PurchaseForm from "../components/purchase/PurchaseForm";
import Invoice from "../components/PurchaseOrder/Invoice";
import PurchaseOrderForm from "../components/PurchaseOrder/PurchaseOrderForm";

// Sales
import SalesList from "../components/Sales/SalesList";
import SalesPage from "../components/Sales/SalesPage";
import SalesForm from "../components/Sales/SalesForm";
import SalesInvoice from "../components/Sales/SalesInvoice";
import CustomerRegistration from "../components/Customers/CustomerRegistration";
import Customer from "../components/Customers/Customer";

const AppRoute = () => {
  const { loading } = useSelector((state) => state.alerts);

  // Safe destructuring with fallback
  const products = useSelector((state) => state.product?.list || []);
  const customers = useSelector((state) => state.customer?.list || []);

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
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/purchase-orders/edit/:id" element={<PurchaseOrderForm />} />
          <Route path="/purchases/create/:poId" element={<PurchaseForm />} />
          <Route path="/invoice/:id" element={<Invoice />} />

           <Route path="/customers" element={<Customer />} />
          <Route path="/customers/create" element={<CustomerRegistration />} />
          <Route path="/customers/edit/:id" element={<CustomerRegistration />} />

          {/* Sales Routes */}
          <Route path="/sales" element={<SalesPage />}>
            <Route index element={<SalesList />} />
            <Route path="create" element={<SalesForm products={products} customers={customers} />} />
            <Route path="edit/:saleId" element={<SalesForm products={products} customers={customers} />} />
            <Route path="/sales/invoice/:id" element={<SalesInvoice />} />
          </Route>
        </Route>

        {/* 🌐 Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />

        


        {/* 🚫 Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoute;
