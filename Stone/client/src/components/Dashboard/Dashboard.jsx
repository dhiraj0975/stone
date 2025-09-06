import React from "react";

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-lg shadow">Purchases: 25</div>
        <div className="p-4 bg-white rounded-lg shadow">Sales: 18</div>
        <div className="p-4 bg-white rounded-lg shadow">Inventory: 320</div>
        <div className="p-4 bg-white rounded-lg shadow">Payment Dues: 12</div>
      </div>
    </div>
  );
};

export default Dashboard;
