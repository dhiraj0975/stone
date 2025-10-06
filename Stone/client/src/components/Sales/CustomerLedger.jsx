import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import paymentsAPI from "../../axios/salePaymentsAPI";
import { fx } from "../../utils/formatter";

const CustomerLedger = () => {
  const { customerId } = useParams();
  const [ledger, setLedger] = useState([]);
  const [totals, setTotals] = useState({ totalSale: 0, totalPaid: 0, totalPending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        setLoading(true);
        const res = await paymentsAPI.getLedgerByCustomer(customerId);
        setLedger(res.data.ledger || []);
        setTotals({
          totalSale: res.data.totalSale || 0,
          totalPaid: res.data.totalPaid || 0,
          totalPending: res.data.totalPending || 0
        });
      } catch (err) {
        console.error(err);
        alert("Failed to fetch customer ledger");
      } finally {
        setLoading(false);
      }
    };
    fetchLedger();
  }, [customerId]);

  return (
    <div className="p-3">
      <h2 className="text-xl font-bold mb-3">Customer Ledger</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="mb-3 font-semibold">
            Total Sale: {fx(totals.totalSale)}, Paid: {fx(totals.totalPaid)}, Pending: {fx(totals.totalPending)}
          </div>

          <table className="w-full border text-sm text-center">
            <thead className="bg-green-700 text-white">
              <tr>
                {["Bill No", "Date", "Total Amount", "Paid", "Pending"].map((h, idx) => (
                  <th key={idx} className="border px-2 py-1">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ledger.map((l, i) => (
                <tr key={i} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-2 py-1">{l.bill_no}</td>
                  <td className="border px-2 py-1">{l.date}</td>
                  <td className="border px-2 py-1">{fx(l.total_amount)}</td>
                  <td className="border px-2 py-1">{fx(l.paid)}</td>
                  <td className="border px-2 py-1">{fx(l.pending)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default CustomerLedger;
