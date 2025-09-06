import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/alertSlice";
import { loginUser } from "../../redux/auth/authThunks";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    dispatch(ShowLoading());
    try {
      await dispatch(loginUser({ email: loginEmail, password: loginPassword }));
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(HideLoading());
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (registerPassword !== registerConfirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert(`Register with:\nName: ${registerName}\nEmail: ${registerEmail}`);
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <div className='bg-white border border-gray-300 rounded-lg shadow-2xl p-8 max-w-md w-full'>
        <div className='flex justify-center mb-6'>
          <button
            onClick={() => setIsLogin(true)}
            className={`px-6 py-2 font-semibold rounded-t-lg border-b-4 ${
              isLogin
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500"
            } focus:outline-none`}
          >
            Login
          </button>
          {/* <button
            onClick={() => setIsLogin(false)}
            className={`px-6 py-2 font-semibold rounded-t-lg border-b-4 ${
              !isLogin
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500"
            } focus:outline-none`}
          >
            Register
          </button> */}
        </div>

        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className='space-y-5'>
            <div>
              <label
                htmlFor='loginEmail'
                className='block text-gray-700 font-medium mb-2'
              >
                Email Address
              </label>
              <input
                type='email'
                id='loginEmail'
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder='you@example.com'
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
            </div>
            <div>
              <label
                htmlFor='loginPassword'
                className='block text-gray-700 font-medium mb-2'
              >
                Password
              </label>
              <input
                type='password'
                id='loginPassword'
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder='Enter your password'
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
            </div>
            <button
              type='submit'
              className='w-full bg-indigo-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition'
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className='space-y-5'>
            <div>
              <label
                htmlFor='registerName'
                className='block text-gray-700 font-medium mb-2'
              >
                Full Name
              </label>
              <input
                type='text'
                id='registerName'
                required
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder='Your full name'
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
            </div>
            <div>
              <label
                htmlFor='registerEmail'
                className='block text-gray-700 font-medium mb-2'
              >
                Email Address
              </label>
              <input
                type='email'
                id='registerEmail'
                required
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder='you@example.com'
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
            </div>
            <div>
              <label
                htmlFor='registerPassword'
                className='block text-gray-700 font-medium mb-2'
              >
                Password
              </label>
              <input
                type='password'
                id='registerPassword'
                required
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder='Enter password'
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
            </div>
            <div>
              <label
                htmlFor='registerConfirmPassword'
                className='block text-gray-700 font-medium mb-2'
              >
                Confirm Password
              </label>
              <input
                type='password'
                id='registerConfirmPassword'
                required
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                placeholder='Confirm password'
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
            </div>
            <button
              type='submit'
              className='w-full bg-indigo-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition'
            >
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
