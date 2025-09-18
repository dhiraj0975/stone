import React from "react";
import PurchaseOrderForm from "./PurchaseOrderForm";
import PurchaseOrderList from "./PurchaseOrderList";
import PurchaseOrderDetails from "./PurchaseOrderDetails";

export default function PurchaseOrders() {
  return (
    <div className=" bg-gray-100 min-h-screen ">
      <h1 className="text-2xl font-bold mb-6">Manage Purchase Orders</h1>

      {/* Create PO Form */}
      <div className="overflow-auto mb-10">
        <PurchaseOrderForm />
      </div>

      {/* PO List */}
      <div className="mb-10">
        <PurchaseOrderList/>
      </div>

      {/* PO Details */}
      <div>
        <PurchaseOrderDetails />
      </div>
    </div>
  );
}
