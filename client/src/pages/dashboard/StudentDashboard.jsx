import React, { useEffect, useState } from "react";
import StudentDashboardHeader from "../../components/StudentDashboardHeader";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const StudentDashboard = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [previous, setPrevious] = useState([]);

  const studentName = useSelector(
    (state) => state?.student?.student?.fullName
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}api/class/all-classes`
        );
        const data = res.data.AllClassess;
        const now = new Date().getTime();

        const upcomingClasses = data.filter((cls) => {
          const classStart = new Date(cls.date).getTime();
          const thirtyFiveMinutesAfter = classStart + 35 * 60 * 1000;
          return now < thirtyFiveMinutesAfter;
        });

        const previousClasses = data.filter((cls) => {
          const classStart = new Date(cls.date).getTime();
          const thirtyFiveMinutesAfter = classStart + 35 * 60 * 1000;
          return now >= thirtyFiveMinutesAfter;
        });

        setUpcoming(upcomingClasses);
        setPrevious(previousClasses);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to fetch classes");
      }
    };
    fetchClasses();
  }, []);

  const handleJoinClass = (roomId) => {
    if (!roomId) {
      toast.error("Room ID not available for this class");
      return;
    }
    navigate(`/classroom/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <StudentDashboardHeader />

      <main className="px-4 md:px-12 py-8 space-y-10">
        {/* Upcoming Classes */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-teal-700 mb-4">
            Upcoming Classes
          </h2>
          {upcoming.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((cls, i) => (
                <div
                  key={i}
                  className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {cls.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Subject: <span className="font-medium">{cls.subject}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Teacher:{" "}
                      <span className="font-medium">{cls.teacherName}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Date:{" "}
                      <span className="font-medium">
                        {new Date(cls.date).toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleJoinClass(cls.roomId)}
                    className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition"
                  >
                    Join Now
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming classes.</p>
          )}
        </section>

        {/* Previous Classes */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-teal-700 mb-4">
            Previous Classes
          </h2>
          {previous.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {previous.map((cls, i) => (
                <div
                  key={i}
                  className="bg-gray-100 shadow rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-700">
                      {cls.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Subject: <span className="font-medium">{cls.subject}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Teacher:{" "}
                      <span className="font-medium">{cls.teacherName}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Date:{" "}
                      <span className="font-medium">
                        {new Date(cls.date).toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <span className="mt-3 text-sm text-green-600 font-medium">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No previous classes.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
