import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { setStudentDetails } from "../../store/studentSlice"; 

const StudentProfile = () => {
  const studentData = useSelector((state) => state?.student?.student);
  const [loading, setLoading] = useState(!studentData);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ add dispatch

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("StudentToken");
        if (!token) {
          navigate("/");
          return;
        }
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}api/student/details`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(setStudentDetails(res.data.student));
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch student data");
        setLoading(false);
      }
    };

    if (!studentData) {
      fetchStudent();
    }
  }, [studentData, dispatch, navigate]);

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}api/student/logout`
      );
      localStorage.removeItem("StudentToken");
      toast.success(res.data.message);
      navigate("/");
      window.location.reload();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error In Logout");
    }
  };

  if (loading || !studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-700 p-6 text-white">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="mt-2 opacity-90">Your personal and academic details</p>
        </div>

        {/* Profile Info */}
        <div className="p-8 flex flex-col md:flex-row gap-8">
          {/* Left */}
          <div className="md:w-1/3 flex flex-col items-center text-center">
            <img
              src={
                studentData?.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <h2 className="mt-4 text-2xl font-semibold text-gray-800">
              {studentData?.fullName}
            </h2>
            <p className="text-gray-600">{studentData?.course}</p>
            <p className="text-gray-500">{studentData?.currentYear} Year</p>
          </div>

          {/* Right */}
          <div className="md:w-2/3 space-y-5">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Personal Information
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li><span className="font-medium">📛 Full Name:</span> {studentData?.fullName}</li>
                <li><span className="font-medium">📘 Course:</span> {studentData?.course}</li>
                <li><span className="font-medium">📅 Year:</span> {studentData?.currentYear}</li>
                <li><span className="font-medium">📧 Email:</span> {studentData?.email}</li>
                <li><span className="font-medium">📱 Mobile:</span> {studentData?.phone}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 flex justify-end gap-10">
          <button
            onClick={handleLogout}
            className="text-xl bg-red-600 font-bold text-white p-2 rounded-lg cursor-pointer"
          >
            Logout
          </button>
          {studentData?._id && (
            <Link
              to={`/student-profile/edit/${studentData._id}`}
              className="px-5 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 flex items-center"
            >
              Edit Profile
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
