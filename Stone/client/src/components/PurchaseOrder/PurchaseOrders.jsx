import React, { useState } from "react";
import PurchaseOrderForm from "./PurchaseOrderForm";
import PurchaseOrderList from "./PurchaseOrderList";

export default function PurchaseOrders() {
  const [editingPO, setEditingPO] = useState(null);

  const handleEdit = (po) => {
    setEditingPO(po);
  };

  const handleFormSubmit = () => {
    setEditingPO(null); // Reset form after submission
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Purchase Orders</h1>

      {/* Create/Edit PO Form */}
      <div className="overflow-auto mb-10 bg-white p-4 rounded-lg shadow-md">
        <PurchaseOrderForm purchaseOrder={editingPO} onSubmitted={handleFormSubmit} />
      </div>

      {/* PO List */}
      <div className="mb-10">
        <PurchaseOrderList onEdit={handleEdit} />
      </div>
    </div>
  );
}
