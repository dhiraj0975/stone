import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { HideLoading, ShowLoading } from "../redux/alertSlice";
import { getProfile } from "../redux/auth/authThunks";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [authChecked, setAuthChecked] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      try {
        dispatch(ShowLoading());
        await dispatch(getProfile()).unwrap();
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        dispatch(HideLoading());
        setAuthChecked(true);
      }
    };

    init();
  }, [dispatch]);

  if (!authChecked) {
    return (
      <div className='text-center mt-8 text-lg'>Checking authentication...</div>
    );
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to='/unauthorized' replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
