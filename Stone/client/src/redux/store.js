
import authReducer from "./auth/authSlice"

import productReducer from '../redux/product/productSlice'

import alertsReducer from "./alertSlice";
import vendorReducer from "../redux/vender/vendorSlice";
import { configureStore } from "@reduxjs/toolkit"

const store = configureStore({
  reducer: {
    alerts: alertsReducer,
   auth: authReducer,
    product: productReducer,
     vendor: vendorReducer, 
     

    
  },
});

export default store;
