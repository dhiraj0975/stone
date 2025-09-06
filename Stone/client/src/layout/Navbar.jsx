// src/components/Navbar.jsx
import React from "react";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-sm border-b px-4 py-3 flex justify-between items-center">
      {/* Left Section: Logo / Search */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="hidden md:block px-3 py-2 text-sm border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Right Section: Icons */}
      <div className="flex items-center gap-5">
        {/* Notification */}
        <button className="relative">
          <BellIcon className="w-6 h-6 text-gray-600 hover:text-blue-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-1 rounded-lg">
          <UserCircleIcon className="w-8 h-8 text-blue-600" />
          <span className="hidden md:block font-medium">Admin</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
