// const {
//   getPurchaseOrders,
//   getPurchaseOrderById,
//   createPurchaseOrder,
//   updatePurchaseOrder,
//   deletePurchaseOrder,
// } = require("../models/purchaseOrder.model");

// // GET all POs
// const fetchPurchaseOrders = async (req, res) => {
//   try {
//     const orders = await getPurchaseOrders();
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // GET single PO
// const fetchPurchaseOrder = async (req, res) => {
//   try {
//     const order = await getPurchaseOrderById(req.params.id);
//     if (!order) return res.status(404).json({ message: "Purchase Order not found" });
//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // CREATE PO
// const addPurchaseOrder = async (req, res) => {
//   try {
//     const result = await createPurchaseOrder(req.body);
//     res.status(201).json({ message: "Purchase Order created", id: result.insertId });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // UPDATE PO
// const editPurchaseOrder = async (req, res) => {
//   try {
//     await updatePurchaseOrder(req.params.id, req.body);
//     res.json({ message: "Purchase Order updated" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // DELETE PO
// const removePurchaseOrder = async (req, res) => {
//   try {
//     await deletePurchaseOrder(req.params.id);
//     res.json({ message: "Purchase Order deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = {
//   fetchPurchaseOrders,
//   fetchPurchaseOrder,
//   addPurchaseOrder,
//   editPurchaseOrder,
//   removePurchaseOrder,
// };




const PurchaseOrder = require("../models/purchaseOrder.model");
const PurchaseOrderItem = require("../models/purchaseOrderItem.model");

// ✅ Helper function for item calculation
const calculateItem = (item) => {
  const amount = item.qty * item.rate;
  const discount_rate = (item.rate * (item.discount_per_qty || 0)) / 100;
  const discount_total = discount_rate * item.qty;
  const netAmount = amount - discount_total;
  const gst_amount = (netAmount * (item.gst_percent || 0)) / 100;
  const final_amount = netAmount + gst_amount;

  return { amount, discount_rate, discount_total, gst_amount, final_amount };
};

const purchaseOrderController = {
  // ✅ Create Purchase Order with Items
  create: async (req, res) => {
    try {
      const {
        po_no,
        vendor_id,
        date,
        bill_time,
        address,
        mobile_no,
        gst_no,
        place_of_supply,
        terms_condition,
        items,
      } = req.body;

      if (!vendor_id) {
        return res.status(400).json({ error: "vendor_id is required" });
      }

      const poData = {
        po_no,
        vendor_id: Number(vendor_id),
        date,
        bill_time,
        address,
        mobile_no,
        gst_no,
        place_of_supply,
        terms_condition,
        total_amount: 0,
        gst_amount: 0,
        final_amount: 0,
      };

      // ✅ Create PO header
      const result = await PurchaseOrder.create(poData);
      const purchase_order_id = result.insertId;

      let totalAmount = 0;
      let totalGST = 0;
      let finalAmount = 0;
      const createdItems = [];

      // ✅ Insert items
      for (const item of items) {
        const {
          amount,
          discount_rate,
          discount_total,
          gst_amount,
          final_amount,
        } = calculateItem(item);

        totalAmount += amount - discount_total;
        totalGST += gst_amount;
        finalAmount += final_amount;

        const itemData = {
          purchase_order_id,
          product_id: Number(item.product_id),
          hsn_code: item.hsn_code,
          qty: Number(item.qty),
          rate: Number(item.rate),
          amount,
          discount_per_qty: Number(item.discount_per_qty || 0),
          discount_rate,
          discount_total,
          gst_percent: Number(item.gst_percent || 0),
          gst_amount,
          final_amount,
        };

        const itemResult = await PurchaseOrderItem.create(itemData);
        createdItems.push({ id: itemResult.insertId, ...itemData });
      }

      // ✅ Update totals
      await PurchaseOrder.update(purchase_order_id, {
        ...poData,
        total_amount: totalAmount,
        gst_amount: totalGST,
        final_amount: finalAmount,
      });

      res.status(201).json({
        message: "Purchase Order created successfully",
        purchase_order: {
          id: purchase_order_id,
          ...poData,
          summary: {
            total_taxable: totalAmount,
            total_gst: totalGST,
            grand_total: finalAmount,
          },
          items: createdItems,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },

  // ✅ Get All Purchase Orders
  getAll: async (req, res) => {
    try {
      const poRows = await PurchaseOrder.getAll();

      // Transform rows into grouped POs with items & summary
      const poMap = {};
      poRows.forEach((row) => {
        const poId = row.purchase_order_id;
        if (!poMap[poId]) {
          poMap[poId] = {
            id: poId,
            po_no: row.po_no,
            vendor_name: row.vendor_name,
            date: row.date,
            bill_time: row.bill_time,
            address: row.address,
            mobile_no: row.mobile_no,
            gst_no: row.gst_no,
            place_of_supply: row.place_of_supply,
            terms_condition: row.terms_condition,
            summary: {
              total_taxable: 0,
              total_gst: 0,
              grand_total: 0,
            },
            items: [],
          };
        }

        // Add item
        const item = {
          id: row.item_id,
          product_id: row.product_id,
          hsn_code: row.hsn_code,
          qty: row.qty,
          rate: row.rate,
          amount: row.amount,
          discount_per_qty: row.discount_per_qty,
          discount_rate: row.discount_rate,
          discount_total: row.discount_total,
          gst_percent: row.gst_percent,
          gst_amount: row.item_gst,
          total: row.item_final,
        };

        poMap[poId].items.push(item);

        // Update summary
        poMap[poId].summary.total_taxable += row.amount - row.discount_total;
        poMap[poId].summary.total_gst += row.item_gst;
        poMap[poId].summary.grand_total += row.item_final;
      });

      const pos = Object.values(poMap);
      res.json(pos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },

  // ✅ Get Single Purchase Order with Items & Summary
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const poRows = await PurchaseOrder.getById(id);
      if (poRows.length === 0)
        return res.status(404).json({ message: "PO not found" });

      const itemRows = await PurchaseOrderItem.getByPOId(id);

      // Calculate summary
      const summary = itemRows.reduce(
        (acc, item) => {
          acc.total_taxable += item.amount - item.discount_total;
          acc.total_gst += item.gst_amount;
          acc.grand_total += item.final_amount;
          return acc;
        },
        { total_taxable: 0, total_gst: 0, grand_total: 0 }
      );

      res.json({
        ...poRows[0],
        items: itemRows,
        summary,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },

  // ✅ Delete Purchase Order with Items
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await PurchaseOrderItem.deleteByPOId(id);
      await PurchaseOrder.delete(id);
      res.json({ message: "Purchase Order deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = purchaseOrderController;
