import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import productReducer from "./product/productSlice";
import alertsReducer from "./alertSlice";
import vendorReducer from "../redux/vender/vendorSlice";

const store = configureStore({
  reducer: {
    alerts: alertsReducer,
    auth: authReducer,
    product: productReducer,
     vendor: vendorReducer, 
     
  },
});

export default store;
