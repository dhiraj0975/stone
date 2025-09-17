
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth/authSlice"
import productReducer from '../redux/product/productSlice'
import alertsReducer from "./alertSlice";
import vendorReducer from "../redux/vender/vendorSlice";
import categoriesReducer from "../redux/categorys/categories.Slice.js";
import purchasesReducer from "../redux/purchase/purchaseSlice.js";


const store = configureStore({
  reducer: {
    alerts: alertsReducer,
   auth: authReducer,
    product: productReducer,
     vendor: vendorReducer, 
     categories: categoriesReducer,
      purchases: purchasesReducer,
     

    
  },
});

export default store;

