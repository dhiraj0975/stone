import React from "react";
import { FaArrowUp, FaDollarSign, FaBoxes, FaInfoCircle } from "react-icons/fa";

const cardData = [
  { icon: <FaArrowUp />, title: "Purchases", value: 25 },
  { icon: <FaDollarSign />, title: "Sales", value: 18 },
  { icon: <FaBoxes />, title: "Inventory", value: 320 },
  { icon: <FaInfoCircle />, title: "Payment Dues", value: 12 },
];

const DashboardCards = () => {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      {cardData.map((card, index) => (
        <div
          key={index}
          className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm p-4 min-w-[200px] flex-1"
        >
          <div className="bg-indigo-100 text-indigo-600 p-3 rounded-md text-lg mr-4">
            {card.icon}
          </div>
          <div>
            <div className="font-medium text-gray-800">{card.title}</div>
            <div className="text-xl font-semibold text-black">{card.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
