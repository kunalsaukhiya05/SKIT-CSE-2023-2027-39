import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const TeacherProfileEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const teacherData = useSelector((state) => state?.teacher?.teacher);
  const inputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subjectSpecialization: "",
    phone: "",
    profileImage:
      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(formData.profileImage);
  const [loading, setLoading] = useState(false);

  // Sync redux teacher data on mount
  useEffect(() => {
    if (teacherData) {
      setFormData({
        fullName: teacherData.fullName || "",
        email: teacherData.email || "",
        subjectSpecialization: teacherData.subjectSpecialization || "",
        phone: teacherData.phone || "",
        profileImage:
          teacherData.profileImage ||
          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      });
      setPreview(
        teacherData.profileImage ||
          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
      );
    }
  }, [teacherData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("subjectSpecialization", formData.subjectSpecialization);

    if (file) {
      data.append("profileImage", file);
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/teacher/teacher-profile/edit/${id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(res.data.message || "Profile updated successfully!");
      navigate("/teacher-profile");
      window.location.reload();
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-emerald-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Edit Teacher Profile
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center">
            <img
              src={preview}
              alt="Profile"
              onClick={() => inputRef.current.click()}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer hover:opacity-90 transition"
            />
            <input
              type="file"
              ref={inputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <p className="mt-2 text-sm text-gray-500">
              Click image to upload new profile photo
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization
            </label>
            <input
              type="text"
              name="subjectSpecialization"
              value={formData.subjectSpecialization}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full border rounded-lg px-4 py-2 bg-gray-200"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              disabled
              className="w-full border rounded-lg px-4 py-2 bg-gray-200"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700"
              }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherProfileEdit;
