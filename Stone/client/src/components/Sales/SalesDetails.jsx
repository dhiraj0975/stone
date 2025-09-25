// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import SalesAPI from "../../axios/salesAPI";
// import { fx } from "../../utils/formatter";

// const SalesDetails = () => {
//   const { id } = useParams(); // customer_id from route
//   const [sales, setSales] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCustomerSales = async () => {
//       try {
//         setLoading(true);
//         const res = await SalesAPI.getSalesByCustomerId(id); // backend API
//         setSales(res.data);
//       } catch (err) {
//         console.error(err);
//         alert("Failed to fetch customer orders");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCustomerSales();
//   }, [id]);

//   return (
//     <div className="p-3">
//       <Link to="/sales" className="text-blue-600 hover:underline mb-3 inline-block">
//         ← Back to Customers
//       </Link>

//       <h2 className="text-xl font-bold mb-3">Customer Orders</h2>

//       {loading ? (
//         <div className="text-center py-5">Loading...</div>
//       ) : sales.length === 0 ? (
//         <div className="text-center py-5 text-gray-500">No orders found.</div>
//       ) : (
//         sales.map((s) => (
//           <div key={s.id} className="mb-5 border rounded shadow-sm">
//             {/* Sale Header */}
//             <div className="bg-gray-100 px-3 py-2 flex justify-between items-center">
//               <div>
//                 <strong>Bill No:</strong> {s.bill_no} | <strong>Date:</strong> {s.bill_date} |{" "}
//                 <strong>Status:</strong> {s.status} | <strong>Payment:</strong> {s.payment_status} ({s.payment_method})
//               </div>
//             </div>

//             {/* Items Table */}
//             <div className="overflow-x-auto">
//               <table className="w-full border text-sm text-center">
//                 <thead className="bg-green-700 text-white">
//                   <tr>
//                     {["SI", "Item Name", "HSNCode", "Qty", "Rate", "Disc %", "GST %", "Final Amt"].map((h, idx) => (
//                       <th key={idx} className="border px-2 py-1">{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(s.items || []).map((r, i) => {
//                     const base = (r.qty || 0) * (r.rate || 0);
//                     const perUnitDisc = ((r.rate || 0) * (r.discount_rate || 0)) / 100;
//                     const totalDisc = (r.qty || 0) * perUnitDisc;
//                     const taxable = Math.max(base - totalDisc, 0);
//                     const gstAmt = (taxable * (r.gst_percent || 0)) / 100;
//                     const final = taxable + gstAmt;

//                     return (
//                       <tr key={i} className="odd:bg-white even:bg-gray-50">
//                         <td className="border px-2 py-1">{i + 1}</td>
//                         <td className="border px-2 py-1">{r.item_name}</td>
//                         <td className="border px-2 py-1">{r.hsn_code}</td>
//                         <td className="border px-2 py-1">{r.qty}</td>
//                         <td className="border px-2 py-1">{fx(r.rate)}</td>
//                         <td className="border px-2 py-1">{r.discount_rate}</td>
//                         <td className="border px-2 py-1">{r.gst_percent}</td>
//                         <td className="border px-2 py-1 font-semibold">{fx(final)}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default SalesDetails;
