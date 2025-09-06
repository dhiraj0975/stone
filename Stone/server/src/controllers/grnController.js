import GoodsReceiptNote from "../models/GoodsReceiptNote.js";
import PurchaseOrder from "../models/PurchaseOrder.js";
import Vendor from "../models/Vendor.js";
import Product from "../models/Product.js";

import { handleGrnInward } from "./inventoryController.js";

// @route   GET /api/grns
export const getGRNs = async (req, res) => {
  try {
    const grns = await GoodsReceiptNote.find()
      .populate("purchaseOrder", "poNumber totalAmount")
      .populate("vendor", "name")
      .populate("receivedBy", "username") // Assuming a User model with username
      .populate("items.product", "name itemCode unitOfMeasurement")
      .sort({ receiptDate: -1 });
    res.status(200).json({ success: true, data: grns });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @route   GET /api/grns/:id
export const getGRNById = async (req, res) => {
  try {
    const grn = await GoodsReceiptNote.findById(req.params.id)
      .populate("purchaseOrder", "poNumber totalAmount")
      .populate("vendor", "name")
      .populate("receivedBy", "username")
      .populate("items.product", "name itemCode unitOfMeasurement");
    if (!grn) {
      return res
        .status(404)
        .json({ success: false, error: "Goods Receipt Note not found" });
    }
    res.status(200).json({ success: true, data: grn });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @route   POST /api/grns

// export const createGRN = async (req, res) => {
//   try {
//     const { grnNumber, purchaseOrder, vendor, receivedBy, items, notes } =
//       req.body;

//     // Basic validation
//     if (!grnNumber || !vendor || !receivedBy || !items || items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error:
//           "GRN Number, Vendor, Receiver, and at least one item are required.",
//       });
//     }

//     // Validate Vendor, Receiver (User), and Products
//     const existingVendor = await Vendor.findById(vendor);
//     if (!existingVendor)
//       return res
//         .status(400)
//         .json({ success: false, error: "Invalid Vendor ID." });
//     // const existingUser = await User.findById(receivedBy); // Uncomment once User model is ready
//     // if (!existingUser) return res.status(400).json({ success: false, error: 'Invalid Receiver User ID.' });

//     for (let i = 0; i < items.length; i++) {
//       const product = await Product.findById(items[i].product);
//       if (!product) {
//         return res.status(400).json({
//           success: false,
//           error: `Product ID ${items[i].product} not found.`,
//         });
//       }
//     }

//     // Handle PO linkage (optional)
//     let po;
//     if (purchaseOrder) {
//       po = await PurchaseOrder.findById(purchaseOrder);
//       if (!po)
//         return res
//           .status(400)
//           .json({ success: false, error: "Invalid Purchase Order ID." });
//       // You might want to update PO status here (e.g., 'Partially Received', 'Received')
//       // This is complex and will be handled more robustly with Inventory module
//     }

//     const grn = await GoodsReceiptNote.create({
//       grnNumber,
//       purchaseOrder,
//       vendor,
//       receivedBy, // In a real app, this would come from `req.user.id` after authentication
//       items,
//       notes,
//     });

//     // --- Inventory Update Logic (Conceptual - Full implementation in Inventory module) ---
//     // For each item in the GRN, add to the inventory
//     // This will be implemented in the Inventory module controller, called from here.
//     // Example:
//     // for (const item of items) {
//     //     await Inventory.addStock(item.product, item.receivedQuantity, 'inward_from_grn', grn._id);
//     // }
//     // --- End Inventory Update Logic ---

//     res.status(201).json({ success: true, data: grn });
//   } catch (err) {
//     if (err.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         error: `GRN Number '${req.body.grnNumber}' already exists.`,
//       });
//     }
//     if (err.name === "ValidationError") {
//       const messages = Object.values(err.errors).map((val) => val.message);
//       return res
//         .status(400)
//         .json({ success: false, error: messages.join(", ") });
//     }
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

export const createGRN = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { grnNumber, purchaseOrder, vendor, receivedBy, items, notes } =
      req.body;

    // Basic validation
    if (!grnNumber || !vendor || !receivedBy || !items || items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        error:
          "GRN Number, Vendor, Receiver, and at least one item are required.",
      });
    }

    // Validate Vendor, Receiver (User), and Products
    const existingVendor = await Vendor.findById(vendor).session(session);
    if (!existingVendor) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, error: "Invalid Vendor ID." });
    }
    // In a real app, 'receivedBy' would be `req.user.id` from authentication.
    // For now, ensure it's a valid ObjectId or a placeholder.
    // const existingUser = await User.findById(receivedBy).session(session);
    // if (!existingUser) { await session.abortTransaction(); return res.status(400).json({ success: false, error: 'Invalid Receiver User ID.' }); }

    for (let i = 0; i < items.length; i++) {
      const product = await Product.findById(items[i].product).session(session);
      if (!product) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          error: `Product ID ${items[i].product} not found.`,
        });
      }
    }

    let po;
    if (purchaseOrder) {
      po = await PurchaseOrder.findById(purchaseOrder).session(session);
      if (!po) {
        await session.abortTransaction();
        return res
          .status(400)
          .json({ success: false, error: "Invalid Purchase Order ID." });
      }
      // Optional: You could update PO status here if needed, but GRN is the primary record
      // po.status = 'Partially Received'; // Or 'Received' if all items are covered
      // await po.save({ session });
    }

    const grn = await GoodsReceiptNote.create(
      [
        {
          grnNumber,
          purchaseOrder,
          vendor,
          receivedBy,
          items,
          notes,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    // ** Call the inventory handler AFTER successful GRN creation **
    await handleGrnInward(grn[0]._id, grn[0].items, receivedBy); // Pass GRN ID, items, and recordedBy

    res.status(201).json({ success: true, data: grn[0] });
  } catch (err) {
    await session.abortTransaction();
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: `GRN Number '${req.body.grnNumber}' already exists.`,
      });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ success: false, error: messages.join(", ") });
    }
    res.status(500).json({ success: false, error: err.message });
  } finally {
    session.endSession();
  }
};

// @route   PUT /api/grns/:id
// Note: GRNs are often immutable or have very limited update capabilities in real systems
export const updateGRN = async (req, res) => {
  try {
    const grn = await GoodsReceiptNote.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("purchaseOrder", "poNumber totalAmount")
      .populate("vendor", "name");

    if (!grn) {
      return res
        .status(404)
        .json({ success: false, error: "Goods Receipt Note not found" });
    }
    res.status(200).json({ success: true, data: grn });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: `GRN Number '${req.body.grnNumber}' already exists.`,
      });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ success: false, error: messages.join(", ") });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

// @route   DELETE /api/grns/:id
export const deleteGRN = async (req, res) => {
  try {
    const grn = await GoodsReceiptNote.findByIdAndDelete(req.params.id);
    if (!grn) {
      return res
        .status(404)
        .json({ success: false, error: "Goods Receipt Note not found" });
    }
    res.status(200).json({
      success: true,
      message: "Goods Receipt Note deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
