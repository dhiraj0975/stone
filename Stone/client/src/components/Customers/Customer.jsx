// src/components/Customers/Customer.jsx
import React, { useState } from "react";
import CustomerRegistration from "./CustomerRegistration";
import CustomerList from "./CustomerList";

const Customer = () => {
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(false); // form toggle

  return (
    <div className="p-4">
      {/* Register Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white active:scale-95 rounded"
      >
        {showForm ? "Close Registration Form" : "Register New Customer"}
      </button>

      {/* Show Form conditionally */}
      {showForm && (
        <CustomerRegistration
          onSuccess={() => {
            setRefresh((p) => !p);
            setShowForm(false); // form close after success
          }}
        />
      )}

      {/* List always visible */}
      <CustomerList key={refresh} />
    </div>
  );
};

export default Customer;
