import React, { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
import TeacherSingup from "./pages/auth/TeacherSingup";
import TeacherLogin from "./pages/auth/TeacherLogin";
import About from "./pages/About";
import Contact from "./pages/Contact";
import StudentProfile from "./pages/profile/StudentProfile";
import TeacherProfile from "./pages/profile/TeacherProfile";
import EditStudentProfile from "./pages/profile/EditStudentProfile";
import TeacherProfileEdit from "./pages/profile/TeacherProfileEdit";
import { setStudentDetails } from "./store/studentSlice";
import { setTeacherDetails } from "./store/teacherSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import Context from "./context/context";

// Lazy-loaded pages (Priority 8: code splitting for performance)

// Placeholders for future sprints
const Classroom = () => <div className="p-10 text-center text-xl font-semibold">Classroom Module (Coming Soon)</div>;
const CreateClassForm = () => <div className="p-10 text-center text-xl font-semibold">Create Class Module (Coming Soon)</div>;
const TeacherAssignments = () => <div className="p-10 text-center text-xl font-semibold">Assignments Module (Coming Soon)</div>;
const StudentAssignment = () => <div className="p-10 text-center text-xl font-semibold">Student Assignments (Coming Soon)</div>;
const TeacherResources = () => <div className="p-10 text-center text-xl font-semibold">Resources Module (Coming Soon)</div>;
const StudentResources = () => <div className="p-10 text-center text-xl font-semibold">Resources Module (Coming Soon)</div>;
const AdminDashboard = () => <div className="p-10 text-center text-xl font-semibold">Admin Dashboard (Coming Soon)</div>;
const AdminLogin = () => <div className="p-10 text-center text-xl font-semibold">Admin Login (Coming Soon)</div>;
const StudentAttendance = () => <div className="p-10 text-center text-xl font-semibold">Student Attendance (Coming Soon)</div>;
const TeacherAttendance = () => <div className="p-10 text-center text-xl font-semibold">Teacher Attendance (Coming Soon)</div>;
const NotificationsPage = () => <div className="p-10 text-center text-xl font-semibold">Notifications (Coming Soon)</div>;
// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
  </div>
);

function App() {
  const [student, setStudent] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const dispatch = useDispatch();

  // Fetch Student Details
  const fetchStudentDetails = async () => {
    try {
      const token = localStorage.getItem("StudentToken");
      if (!token) return;

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}api/student/details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const studentData = response.data.student;

      setStudent(studentData);
      dispatch(setStudentDetails(studentData));

    } catch (err) {
      console.error("Error fetching student details:", err);
      localStorage.removeItem("StudentToken");
    }
  };

  // Fetch Teacher Details
  const fetchTeacherDetails = async () => {
    try {
      const token = localStorage.getItem("TeacherToken");
      if (!token) return;

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}api/teacher/details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const teacherData = response.data.teacher;

      setTeacher(teacherData);
      dispatch(setTeacherDetails(teacherData));
    } catch (err) {
      console.error("Error fetching teacher details:", err);
      localStorage.removeItem("TeacherToken");
    }
  };

  useEffect(() => {
    fetchStudentDetails();
    fetchTeacherDetails();
  }, []);

  return (
    <Context.Provider
      value={{ student, fetchStudentDetails, teacher, fetchTeacherDetails }}
    >
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/teachersingup" element={<TeacherSingup />} />
          <Route path="/teacherlogin" element={<TeacherLogin />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/student-profile" element={<StudentProfile />} />
          <Route path="/teacher-profile" element={<TeacherProfile />} />
          <Route path="/student-profile/edit/:id" element={<EditStudentProfile />} />
          <Route path="/teacher-profile/edit/:id" element={<TeacherProfileEdit />} />
          <Route path="/mentor-assignment" element={<TeacherAssignments />} />
          <Route path="/student-assignment" element={<StudentAssignment />} />
          <Route path="/teacher-resourses" element={<TeacherResources />} />
          <Route path="/student-resources" element={<StudentResources />} />
          <Route path="/create-class" element={<CreateClassForm />} />
          <Route path="/classroom/:id" element={<Classroom />} />
          {/* New routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/student-attendance" element={<StudentAttendance />} />
          <Route path="/teacher-attendance" element={<TeacherAttendance />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
      </Suspense>
    </Context.Provider>
  );
}

export default App;


