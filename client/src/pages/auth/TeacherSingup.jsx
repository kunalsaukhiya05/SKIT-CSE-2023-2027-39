import React, { useState } from 'react'
import Header from '../../components/Header';
import { toast } from "react-hot-toast";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setUpRecaptcha } from "./firebase.capcha.js";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";


const TeacherSingup = () => {


    const [step, setStep] = useState(1);
    const [result, setResult] = useState(null);
    const [otp, setOtp] = useState('');
     const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subjectSpecialization: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

    const toggleButtonPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async(e) => {
    e.preventDefault();
    try {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.subjectSpecialization) {
        return toast.error("All fields are required");
      }

      if (formData.phone.length !== 10) {
        return toast.error("Please enter a valid 10 digit phone number");
      }

      setLoading(true);

      const confirmation = await setUpRecaptcha("+91" + formData.phone);
      setResult(confirmation);
      toast.success("OTP sent!");
      setLoading(false);
      setStep(2);
    } catch (err) {
      console.error("OTP Error:", err);
      toast.error(err.message || "Failed to send OTP");
    }
  };

  // Verify OTP and Signup
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      if (!result) {
        return toast.error("Something went wrong! Please retry.");
      }

      if (!otp || otp.length !== 6) {
        return toast.error("Enter a valid 6-digit OTP");
      }

      // Firebase OTP verify
      await result.confirm(otp);
      toast.success("OTP verified");

        setLoading(true);
      // Call backend signup API
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/teacher/signup`,
        formData,
        { withCredentials: true }
      );

      if (res.status === 201) {
        toast.success(res.data.message || "Student Registered");
        // console.log("Student Data:", res.data.student);

        localStorage.setItem("TeacherToken", res.data.token);

        setLoading(true);
        // Navigate to login/dashboard
        navigate("/",{replace:true});
        window.location.reload();
      }
    } catch (err) {
      console.error("Signup error:", err);

      if (err.response) {
        // Backend se error
        toast.error(err.response.data.message || "Signup Failed");
      } else if (err.request) {
        // Server response nahi aaya
        toast.error("Server not responding. Try again later!");
      } else {
        // Coding error
        toast.error("Enter Valid OTP!");
      }
    }
  };

  return (
    <>
        <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg mt-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-700 mb-6">
          Teacher Signup
        </h2>
      {step === 1 && (
        <form onSubmit={handleSendOTP} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

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
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Mobile Number (OTP Verification)
            </label>
            <input
              type="number"
              name="phone"
              placeholder="10-digit mobile number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
              />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Subject Specialization
            </label>
            <input
              type="text"
              name="subjectSpecialization"
              placeholder="Computer Science, Mathematics, History"
              value={formData.subjectSpecialization}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

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

   {/* Recaptcha container */}
              <div id="recaptcha-container"></div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition cursor-pointer"
            >
              {
                loading ? "Wait..." : "Signup as Teacher"
              }
            
          </button>
        </form>
)}

{step === 2 && (
  <form onSubmit={handleVerifyOtp}>
              <label className="block text-gray-700 mb-2 font-medium">
                Enter OTP
              </label>
              <input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
              />
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition cursor-pointer"
              >
                {
                  loading ? "Veryfing OTP..." : "Verify & Signup"
                }
              </button>
            </form>
)}


        {/* Already Registered */}
        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <a href="/teacherlogin" className="text-teal-600 font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
            </>
  )
}

export default TeacherSingup
