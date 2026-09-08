import React, { useEffect, useState } from "react";
import TeacherDashboardHeader from "../../components/TeacherDashboardHeader";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiBook, FiVideo } from "react-icons/fi";
import { useSelector } from "react-redux";

const TeacherDashboard = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [previous, setPrevious] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);

  const teacherName = useSelector((state) => state?.teacher?.teacher?.fullName);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}api/class/all-classes`
        );
        if (res.data && res.data.AllClassess) {
          const data = res.data.AllClassess;
          categorizeClasses(data);
        } else {
          toast.error("No classes data received");
        }
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to fetch classes");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const categorizeClasses = (classes) => {
    const now = new Date();

    const upcomingClasses = classes.filter(
      (cls) => new Date(cls.date) > now
    );

    const previousClasses = classes.filter((cls) => {
      const classTime = new Date(cls.date);
      const classDuration = cls.duration || 60;
      const classEndTime = new Date(
        classTime.getTime() + classDuration * 60 * 1000
      );
      return classEndTime <= now;
    });

    setUpcoming(upcomingClasses);
    setPrevious(previousClasses);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleJoinClass = (roomId) => {
    if (!roomId) {
      toast.error("Room ID not available for this class");
      return;
    }
    navigate(`/classroom/${roomId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <TeacherDashboardHeader />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <TeacherDashboardHeader />

      <main className="px-4 md:px-12 py-8 space-y-10">
        {/* Welcome Header */}
        <section className="bg-gradient-to-r from-teal-500 to-teal-700 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, {teacherName || "Teacher"}!
          </h1>
          <p className="opacity-90">
            Manage your classes, resources, and student engagements from your
            dashboard.
          </p>
        </section>

        <Link
          to={"/create-class"}
          className="text-2xl font-medium bg-teal-300 p-2 rounded cursor-pointer mb-3"
        >
          Create Class
        </Link>

        {/* Classes Section */}
        <section className="bg-white rounded-2xl p-6 shadow-md mt-3">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "upcoming"
                  ? "text-teal-600 border-b-2 border-teal-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming Classes ({upcoming.length})
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "previous"
                  ? "text-teal-600 border-b-2 border-teal-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("previous")}
            >
              Previous Classes ({previous.length})
            </button>
          </div>

          {activeTab === "upcoming" &&
            upcoming.map((cls) => (
              <div key={cls._id} className="p-4 border rounded-lg mb-4">
                <h3 className="text-lg font-bold">{cls.title}</h3>
                <p className="text-sm text-gray-600">Subject: {cls.subject}</p>
                <p>{formatDate(cls.date)}</p>
                <button
                  onClick={() => handleJoinClass(cls.roomId)}
                  className="bg-teal-600 text-white px-4 py-2 mt-2 rounded-lg cursor-pointer hover:bg-teal-700 transition"
                >
                  Join Class
                </button>
              </div>
            ))}
        </section>
      </main>
    </div>
  );
};

export default TeacherDashboard;
