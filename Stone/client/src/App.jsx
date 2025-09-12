// src/App.js
import React from "react";
import AppRoute from "./routes/AppRoute";
import { useSelector } from "react-redux";
import Spinner from "./components/Spinner";
import { Toaster } from "react-hot-toast";


const App = () => {
  const { loading } = useSelector((state) => state.alerts);

  return (
    <>
      <AppRoute />
      {/* <Toaster /> */}
    </>
  );
};

export default App;
