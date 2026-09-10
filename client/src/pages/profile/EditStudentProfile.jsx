import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const EditStudentProfile = () => {
  const studentData = useSelector((state) => state?.student?.student);
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    fullName: "",
    course: "",
    currentYear: "",
    email: "",
    phone: "",
  });

  const [previewProfile, setPreviewProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Sync redux data on mount
  useEffect(() => {
    if (studentData) {
      setFormData({
        fullName: studentData.fullName || "",
        course: studentData.course || "",
        currentYear: studentData.currentYear || "",
        email: studentData.email || "",
        phone: studentData.phone || "",
      });
      setPreviewProfile(
        studentData.profileImage ||
          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
      );
    }
  }, [studentData]);

  // Handle text change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile image upload
  const handleProfilePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const url = URL.createObjectURL(file);
      setPreviewProfile(url);
    }
  };

  // Submit
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);

      // If you want to allow backend to update course/year/email/phone in future:
      data.append("course", formData.course);
      data.append("currentYear", formData.currentYear);
      data.append("email", formData.email);
      data.append("phone", formData.phone);

      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/student/student-profile/edit/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
console.log(response)
      if (response.status === 200) {
        toast.success(response.data.message || "Profile updated successfully!");
        navigate("/student-profile");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.error || "Failed to update profile. Try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <p className="mt-2 opacity-90">Update your personal details here</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-8 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <img
              src={previewProfile}
              alt="Profile"
              onClick={() => inputRef.current.click()}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer hover:opacity-90 transition"
            />
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={handleProfilePreview}
              className="hidden"
            />
            <p className="mt-2 text-sm text-gray-500">
              Click image to upload new profile photo
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <input
              type="text"
              name="course"
              value={formData.course}
              disabled
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-200"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="text"
              name="currentYear"
              value={formData.currentYear}
              disabled
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-200"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-200"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              disabled
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-200"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/student-profile")}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-md cursor-pointer"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentProfile;
