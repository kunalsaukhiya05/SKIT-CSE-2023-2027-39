import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const CreateClassForm = () => {
  const teacher = useSelector((state) => state?.teacher?.teacher);

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    date: "",
    teacherName: teacher?.fullName || "",
  });
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const token = localStorage.getItem("TeacherToken");

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/class/create`,
        {
          ...formData,
          teacherName: formData.teacherName || teacher?.fullName || "Teacher",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.message || "Class Created Successfully!");
      navigate("/teacher-dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create class");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">
          Create New Class
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter class title"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter subject"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Description (optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief class description"
              rows={2}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Date & Time */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Date & Time</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Teacher Name */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Teacher Name</label>
            <input
              type="text"
              name="teacherName"
              value={formData.teacherName}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <p className="text-sm text-gray-500">
            Room ID will be auto-generated on the server.
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition duration-300 cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Class"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateClassForm;
