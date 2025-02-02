import React,{useState} from 'react'
import Navbar from '../../components/Navbar/Navbar'
import PasswordInput from '../../components/Navbar/Input/PasswordInput'
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'

import axiosInstance from "../../utils/axiosInstance"; // Adjust path if necessary

const SignUp = () => {


  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null);


  const navigate = useNavigate();
  const handleSignUp = async (e) => {
    e.preventDefault();
    if(!name){
      setError("Please enter your name");
      return;
    }
    if(!validateEmail(email)){
      setError("Please enter a valid email");
      return;
    }
    if(!password){
      setError("Please enter a password");
      return;
    }
    setError('')

    //  Signup API Call

    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password
      });
      // handle successful signup response

      if (response.data && response.data.error) {
       setError(response.data.message)
       return
      }

      if(response.data && response.data.accessToken){
        localStorage.setItem('token', response.data.accessToken);
        navigate('/dashboard')
      }
    } catch (error) {
      // handle login error
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong");
      }
    }


  }

  return (
    <>
      <Navbar />

      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handleSignUp}>
            <h4 className='text-2xl mb-7' >Signup</h4>

            <input type='text' placeholder='Name' className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input type='text' placeholder='Email' className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}


            />
            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
        <button type='submit' className='w-full text-sm bg-red-500 text-white p-2 rounded my-1 hover:bg-blue-600'>Create Account</button>

        <p className='text-sm text-center mt-4'>Already have an Account?{" "}
          <Link to='/login' className='font-medium text-primary underline'>
          Login
          </Link>
        </p>


          </form>
        </div>
      </div>
    </>
  )
}

export default SignUp
