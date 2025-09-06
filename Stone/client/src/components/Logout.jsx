import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/auth/authThunks";
import toast from "react-hot-toast";

const LogoutComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await dispatch(logoutUser());
      toast.success("You have been logged out successfully.");
      navigate("/login");
    };

    performLogout();
  }, [dispatch, navigate]);

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-semibold text-gray-800'>
        You have been logged out.
      </h2>
    </div>
  );
};

export default LogoutComponent;
