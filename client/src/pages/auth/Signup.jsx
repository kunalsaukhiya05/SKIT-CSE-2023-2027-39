import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import { setUpRecaptcha } from "./firebase.capcha.js";
import { toast } from "react-hot-toast";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [course, setCourse] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const [otp, setOtp] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      if (
        !fullName ||
        !email ||
        !phone ||
        !password ||
        !course ||
        !currentYear
      ) {
        return toast.error("All fields are required");
      }

      if (phone.length !== 10) {
        return toast.error("Please enter a valid 10 digit phone number");
      }
      setLoading(true);
      const confirmation = await setUpRecaptcha("+91" + phone);
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
      toast.success("Phone verified ");

      setLoading(true);
      // Call backend signup API
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/student/signup`,
        { fullName, email, phone, course, currentYear, password },
        { withCredentials: true }
      );

      if (res.status === 201) {
        toast.success(res.data.message || "Student Registered 🎉");
        // console.log("Student Data:", res);

        localStorage.setItem("StudentToken", res.data.token);
        // Navigate to login/dashboard
        setLoading(false);
        navigate("/", { replace: true });
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

  const toggleButtonPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-700 mb-6">
            Student Signup
          </h2>

          {step === 1 && (
            <form onSubmit={handleSendOtp}>
              <label className="block text-gray-700 mb-2 font-medium">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter Your Full Name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <label className="block text-gray-700 mb-2 font-medium">
                Email ID
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className="block text-gray-700 mb-2 font-medium">
                Mobile Number
              </label>
              <input
                type="number"
                placeholder="Enter your 10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
              />

              <label className="block text-gray-700 mb-2 font-medium">
                Course
              </label>
              <input
                type="text"
                placeholder="Enter Your Course"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              />

              <label className="block text-gray-700 mb-2 font-medium">
                Current Course Year
              </label>
              <input
                type="number"
                placeholder="Enter Current Course Year"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
                value={currentYear}
                onChange={(e) => setCurrentYear(e.target.value)}
              />

              <label className="block text-gray-700 mb-2 font-medium">
                Password
              </label>
              <div className="relative flex items-center justify-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="absolute right-2 top-5 cursor-pointer" onClick={toggleButtonPassword}>
                  {showPassword ? <FiEye /> : <FiEyeOff />}
                </span>
              </div>

              {/* Recaptcha container */}
              <div id="recaptcha-container"></div>

              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition cursor-pointer"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
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
                {loading ? "Wait Veryfing..." : "Verify & Signup"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-teal-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
