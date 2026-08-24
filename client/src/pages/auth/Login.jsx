import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import Header from "../../components/Header";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword , setShowPassword] = useState(false);

  const navigate = useNavigate();

    const toggleButtonPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/student/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success(res.data.message);

        // Save token in localStorage
        localStorage.setItem("StudentToken", res.data.token);

        // Navigate to home page
        navigate("/", { replace: true });
        setLoading(false);
        window.location.reload();
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message || "Login failed");
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } else if (err.request) {
        toast.error("No response from server");
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } else {
        toast.error("Something went wrong");
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
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-700 mb-6">
            Student Login
          </h2>

          <form onSubmit={handleSubmit}>
            <label className="block text-gray-700 mb-2 font-medium">
              Email ID
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="block text-gray-700 mb-2 font-medium">
              Password
            </label>
            <div className="relative flex items-center justify-center">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
                required
              />
              <span
                className="absolute right-2 top-5 cursor-pointer"
                onClick={toggleButtonPassword}
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </span>
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition cursor-pointer"
            >
              {loading ? "Wait..." : "Login"}
            </button>
          </form>

          {/* Already have account */}
          <p className="mt-6 text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-teal-600 font-medium hover:underline"
            >
              Signup
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
