import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Navbar/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';

import axiosInstance from "../../utils/axiosInstance";


const Login = () => {
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Invalid Email");
      return;
    } 
    if (!password) {
      setError("Password is required");
      return;
    }
    setError("");
    // Login API Call

    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password
      });
      // handle successful login response

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        console.log("Token saved:", response.data.accessToken);
        navigate('/dashboard');
      }
    } catch (error) {
      // handle login error
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handleLogin}>
            <h4 className='text-2xl mb-7'>Login</h4>
            <input
              type='text'
              placeholder='Email'
              className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none'
              value={email}
              onChange={(e) => SetEmail(e.target.value)}
            />
            <PasswordInput value={password} onChange={(e) => SetPassword(e.target.value)} />
            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
            <button type='submit' className='w-full text-sm bg-red-500 text-white p-2 rounded my-1 hover:bg-blue-600'>Login</button>
            <p className='text-sm text-center mt-4'>Not Registered yet?
              <Link to='/signup' className='font-medium text-primary underline'>
                Create An Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
