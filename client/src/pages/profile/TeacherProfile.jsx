import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { setTeacherDetails } from "../../store/teacherSlice"; 

const TeacherProfile = () => {
  const teacherData = useSelector((state) => state?.teacher?.teacher);
  const [loading, setLoading] = useState(!teacherData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const token = localStorage.getItem("TeacherToken");
        if (!token) {
          navigate("/");
          return;
        }
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}api/teacher/details`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        dispatch(setTeacherDetails(res.data.teacher));
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch teacher data");
        setLoading(false);
      }
    };

    if (!teacherData) {
      fetchTeacher();
    }
  }, [teacherData, dispatch, navigate]);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}api/teacher/logout`);
      localStorage.removeItem("TeacherToken");
      toast.success(res.data.message);
      navigate("/");
      window.location.reload();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error In Logout");
    }
  };

  if (loading || !teacherData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-teal-200">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-teal-700 to-emerald-700 p-8 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-800/20 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-600/20 rounded-full -ml-12 -mb-12"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold">Teacher Profile</h1>
              <p className="text-teal-100 mt-2">Manage your professional information</p>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8 flex flex-col lg:flex-row gap-10">
            {/* Left Section */}
            <div className="lg:w-1/3 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-teal-100">
                  <img
                    src={teacherData?.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    alt={teacherData?.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 text-center">
                {teacherData?.fullName}
              </h2>
              <p className="text-teal-600 font-medium text-center">
                {teacherData?.designation || "Professor"}
              </p>

              {/* Contact Info */}
              <div className="mt-6 w-full bg-gradient-to-r from-teal-50 to-emerald-50 p-6 rounded-2xl border border-teal-100">
                <h3 className="text-lg font-semibold text-teal-800 mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <p>
                    <span className="font-medium">📧 Email: </span>
                    {teacherData?.email}
                  </p>
                  <p>
                    <span className="font-medium">📱 Mobile: </span>
                    {teacherData?.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="lg:w-2/3 space-y-6">
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 rounded-2xl border border-teal-100">
                <h3 className="text-xl font-bold text-teal-800 mb-3">Specialization</h3>
                <p className="text-gray-700">
                  {teacherData?.subjectSpecialization || "Not Provided"}
                </p>
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
            {teacherData?._id && (
              <Link
                to={`/teacher-profile/edit/${teacherData._id}`}
                className="px-5 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition flex items-center shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Profile
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
