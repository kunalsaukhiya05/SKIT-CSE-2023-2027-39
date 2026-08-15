import React, { useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Redux state se student aur teacher nikal rahe
  const student = useSelector((state) => state?.student?.student);
  const teacher = useSelector((state) => state?.teacher?.teacher);

  // Common Links
  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/login", label: "Student" },
    { to: "/teacherlogin", label: "Teacher" },
  ];

  const studentLinks = [
    { to: "/student-dashboard", label: "Dashboard" },
    { to: "/student-assignment", label: "Assignments" },
    { to: "/student-resources", label: "Resources" },
    { to: "/student-profile", label: "Profile" },
    { to: "/logout", label: "Logout" },
  ];

  const teacherLinks = [
    { to: "/teacher-dashboard", label: "Dashboard" },
    { to: "/mentor-assignment", label: "Assignments Upload" },
    { to: "/teacher-resourses", label: "Resources Upload" },
    // { to: "/notes", label: "Notes / PDFs" },
    { to: "/lectures", label: "Lectures" },
    { to: "/teacher-profile", label: "Profile" },
    { to: "/logout", label: "Logout" },
  ];

  // Decide user type
  let navLinks = publicLinks;
  if (student?.role === "student") navLinks = studentLinks;
  if (teacher?.role === "teacher") navLinks = teacherLinks;

  // Universal Logout Handler
  const handleLogout = async () => {
    try {
      if (student?.role === "student") {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}api/student/logout`);
        localStorage.removeItem("StudentToken");
        toast.success(res.data.message);
        navigate("/login");
      } else if (teacher?.role === "teacher") {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}api/teacher/logout`);
        localStorage.removeItem("TeacherToken");
        toast.success(res.data.message);
        navigate("/teacherlogin");
      }
      window.location.reload();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error In Logout");
    }
  };

  return (
    <div className="w-full mb-10">
      {/* Desktop Header */}
      <header className="flex justify-between items-center px-6 py-4 shadow bg-white fixed top-0 left-0 w-full z-50">
        <div className="flex items-center justify-center gap-4">
          <Link to={"/"} ><img src="./logo.png" alt="" className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-black/50 cursor-pointer" /></Link>
          <Link to={"/"}><h1 className="text-2xl font-bold text-teal-700 cursor-pointer">GyaanSetu</h1></Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
          {navLinks.map((link) => {
            if (link.label === "Logout") {
              return (
                <button
                  key="logout"
                  onClick={handleLogout}
                  className="hover:text-red-600 cursor-pointer"
                >
                  Logout
                </button>
              );
            }
            return (
              <Link key={link.to} to={link.to} className="hover:text-teal-600">
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-3xl text-gray-800 cursor-pointer"
          onClick={() => setMenuOpen(true)}
        >
          <CiMenuFries />
        </button>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center px-6 py-4 shadow bg-teal-600 text-white">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={() => setMenuOpen(false)} className="text-3xl">
            <IoMdClose />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col px-6 py-6 space-y-4 text-gray-700 font-medium">
          {navLinks.map((link) => {
            if (link.label === "Logout") {
              return (
                <button
                  key="logout"
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="hover:text-red-600 text-left cursor-pointer"
                >
                  Logout
                </button>
              );
            }
            return (
              <Link
                key={link.to}
                to={link.to}
                className="hover:text-teal-600"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Header;
