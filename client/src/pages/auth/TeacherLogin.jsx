import React, { useState } from 'react'
import {Link} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-hot-toast';
import axios from "axios";
import Header from '../../components/Header';
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";

const TeacherLogin = () => {


     const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);

    const toggleButtonPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}api/teacher/login`, formData, {withCredentials:true});
      if(res.status == 200){
        toast.success(res.data.message);
        // console.log(res)
        localStorage.setItem("TeacherToken", res.data.token)
        setLoading(false);
        navigate("/", {replace:true});
        window.location.reload();
      }
    }catch(err){
      if(err.response){
        toast.error(err.response.data.message);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }else if(err.request){
        toast.err(err);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    }
  };


  return (
    <>
        <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg mt-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-700 mb-6">
          Teacher Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
              />
          </div>

          {/* Mobile */}
            <label className="block text-gray-700 mb-2 font-medium">
              Password
            </label>
          <div className='relative flex items-center justify-center'>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Your Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
              />

 <span className="absolute right-2 top-5 cursor-pointer" onClick={toggleButtonPassword}>
                  {showPassword ? <FiEye /> : <FiEyeOff />}
                </span>

          </div>


          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition cursor-pointer"
            >
            {
              loading ? "Wait..." : "Login"
            }
          </button>
        </form>

        {/* Already Registered */}
        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <a href="/teachersingup" className="text-teal-600 font-medium hover:underline">
            Signup
          </a>
        </p>
      </div>
    </div>
            </>
  )
}

export default TeacherLogin
