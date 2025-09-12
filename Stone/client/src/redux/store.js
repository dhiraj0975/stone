
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth/authSlice"
import productReducer from '../redux/product/productSlice'
import alertsReducer from "./alertSlice";
import vendorReducer from "../redux/vender/vendorSlice";
import categoriesReducer from "../redux/categorys/categories.Slice";


const store = configureStore({
  reducer: {
    alerts: alertsReducer,
   auth: authReducer,
    product: productReducer,
     vendor: vendorReducer, 
     categories: categoriesReducer,
     

    
  },
});

export default store;
