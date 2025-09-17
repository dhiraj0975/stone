// src/components/Sidebar.jsx
import React, { useState } from "react";
import {
  FiHome,
  FiUsers,
  FiShoppingBag,
  FiLayers,
  FiPackage,
  FiPieChart,
  FiFileText,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
// 
  const mainMenu = [
    { name: "Dashboard", path: "/", icon: <FiHome size={20} /> },
    { name: "Vendor Master", path: "/vendor", icon: <FiUsers size={20} /> },
    { name: "Categories", path: "/category", icon: <FiUsers size={20} /> },
    { name: "Product", path: "/product", icon: <FiPackage size={20} /> },
    { name: "Purchases", path: "/purchases", icon: <FiShoppingBag size={20} /> },
    { name: "PO List", path: "/purchase-orders", icon: <FiFileText size={20} /> },
    { name: "BOM", path: "/bom", icon: <FiLayers size={20} /> },
    { name: "Production Entry", path: "/production", icon: <FiPackage size={20} /> },
    { name: "Inventory", path: "/inventory", icon: <FiPieChart size={20} /> },
    { name: "Invoicing", path: "/invoicing", icon: <FiFileText size={20} /> },
    
  ];

  const generalMenu = [
    { name: "Logout", path: "/login", icon: <FiLogOut size={20} /> },
  ];

  return (
    
    <div
      className={`
        ${sidebarCollapsed ? "w-20" : "w-64"}
        fixed md:relative inset-y-0 left-0 h-full bg-white shadow-lg z-20
        transition-all duration-300 ease-in-out
        flex flex-col  border-r border-gray-100
      `}
      
    >
     


      {/* Collapse Buttons */}
      {!sidebarCollapsed ? (
        <button
          onClick={() => setSidebarCollapsed(true)}
          className="hidden md:flex absolute -right-3 top-20 bg-white rounded-full shadow-md p-1 border"
        >
          <FiChevronLeft size={16} />
        </button>
      ) : (
        
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="hidden md:flex absolute -right-3 top-20 bg-white rounded-full shadow-md p-1 border"
        >
          <FiChevronRight size={16} />
        </button>
      )}
     
      {/* Main Menu */}
      <div className="overflow-y-auto flex-1 py-4">
        <div className="px-5">
          {!sidebarCollapsed && (
            <>
              <h1 className="text-3xl  font-bold text-blue-600">StoneERP</h1>
              <h2 className="text-xs uppercase pt-3 text-gray-500 font-medium tracking-wider mb-2 px-2">
                Main Menu
              </h2>
            </>
          )}
          <ul className="space-y-1">
            {mainMenu.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center p-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    } ${sidebarCollapsed ? "justify-center" : ""}`
                  }
                >
                  <span className="text-gray-500">{item.icon}</span>
                  {!sidebarCollapsed && <span className="ml-3">{item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* General Menu */}
        <div className="mt-8 px-4">
          {!sidebarCollapsed && (
            <h2 className="text-xs uppercase text-gray-500 font-medium tracking-wider mb-2 px-2">
              General
            </h2>
          )}
          <ul className="space-y-1">
            {generalMenu.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => {
                    if (item.name === "Logout") {
                      // 👇 yaha aap redux logout ya localStorage clear kar sakte ho
                      localStorage.removeItem("token");
                      navigate("/login");
                    }
                  }}
                  className="w-full flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-all
                    ${sidebarCollapsed ? 'justify-center' : ''}"
                >
                  <span className="text-gray-500">{item.icon}</span>
                  {!sidebarCollapsed && <span className="ml-3">{item.name}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {!sidebarCollapsed && (
        <div className="p-4 border-t border-gray-100 text-center text-xs text-gray-500">
          StoneERP v1.0.0
        </div>
      )}
    </div>
  );
};

export default Sidebar;
