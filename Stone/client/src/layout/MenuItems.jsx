// import { Home, List, LogOut } from "lucide-react";

// import { useLocation, useNavigate } from "react-router-dom";
// // import { App } from "antd";
// import { MdAdminPanelSettings } from "react-icons/md";
// // import toast from "react-hot-toast";
// import { useSelector } from "react-redux";

// const MenuItems = () => {
//   const iconSize = 20;
//   const location = useLocation();
//   const currentPath = location.pathname;
//   const navigate = useNavigate();

//   const adminMenu = [
//     {
//       name: "Dashboard",
//       path: "/",
//       icon: <Home size={iconSize} />,
//       isActive: currentPath === "/",
//     },
//     {
//       name: "Banks",
//       path: "/bank-logo",
//       icon: <Home size={iconSize} />,
//       isActive: currentPath === "/bank-logo",
//     },
//     {
//       name: "Invoice All",
//       path: "#",
//       icon: <List size={iconSize} />,
//       isActive: currentPath.includes("#"),
//     },
//     {
//       name: "Manage Employees",
//       path: "/admin/employees",
//       icon: <MdAdminPanelSettings size={iconSize} />,
//       isActive: currentPath.includes("/admin/employees"),
//     },
//     { name: "Logout", path: "/logout", icon: <LogOut size={iconSize} /> },
//   ];

//   const fieldOfficerMenu = [
//     {
//       name: "Dashboard",
//       path: "/field/dashboard",
//       icon: <Home size={iconSize} />,
//       isActive: currentPath === "/field/dashboard",
//     },
//     { name: "Logout", path: "/logout", icon: <LogOut size={iconSize} /> },
//   ];

//   const onLogout = () => {
//     localStorage.removeItem("token");

//     navigate("/login");
//     toast.success("Logged Out Successfully");
//   };

// //   const user = useSelector((state) => state.auth.user);

// //   const menus = user?.role === "Admin" ? adminMenu : fieldOfficerMenu;

//   return (
//     <div className='h-full w-full'>
//       {/* User Avatar Section */}
//       <div className='flex items-center gap-3 mb-6'>
//         <div className='h-12 w-12 uppercase bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md'>
        
//         </div>
//         <div>
//           <h1 className='text-gray-800 font-semibold text-md'>{user?.name}</h1>
     
//         </div>
//       </div>

//       {/* Menu Items */}
//       <div className='flex flex-col gap-2'>
//         {adminMenu.map((item) => (
//           <div
//             key={item.name}
//             onClick={() => {
//               if (item.name === "Logout") {
//                 onLogout();
//               } else {
//                 navigate(item.path);
//               }
//             }}
//             className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
//               item.isActive
//                 ? "bg-[#C40C0C] text-white shadow-md"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             {item.icon}
//             <span className='text-sm font-medium'>{item.name}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MenuItems;