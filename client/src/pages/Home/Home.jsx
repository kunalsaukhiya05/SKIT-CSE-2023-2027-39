import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ChatICON from "../../components/ChatICON";
import AIChatbot from "../AIChatBot/AIChatBot";

import StudentHomeContent from "./StudentHomeContent";
import TeacherHomeContent from "./TeacherHomeContent";

export default function Home() {
  const student = useSelector((state) => state?.student?.student);
  const teacher = useSelector((state) => state?.teacher?.teacher);

  const isStudent = Boolean(student?._id);
  const isTeacher = Boolean(teacher?._id);

  return (
    <div className="min-h-screen relative text-gray-800 antialiased bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        {/* Hero */}
        <section className="grid lg:grid-cols-2 items-center gap-12 pt-24">
          <div className="space-y-6 animate-slideUp">
            <h1 className="text-4xl md:text-5xl leading-tight font-extrabold text-gray-900">
              GyaanSetu — Remote Classroom
              <br />
              for Rural Colleges
            </h1>
            <p className="max-w-xl text-lg text-gray-600">
              Bringing quality, low-bandwidth education to every village. Video
              classes, offline resources, attendance automation and multilingual
              support — built for real classrooms.
            </p>

            {/* Show Join Buttons only if not logged in */}
            {!isStudent && !isTeacher && (
              <div className="flex gap-4 mt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-3 bg-teal-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-md hover:bg-teal-700 transform transition-all duration-200"
                  aria-label="Join as student"
                >
                  Join as Student
                </Link>

                <Link
                  to="/teacherlogin"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-gray-200 bg-white text-teal-600 font-semibold hover:bg-gray-50 transform transition-all duration-200"
                  aria-label="Join as teacher"
                >
                  Join as Teacher
                </Link>
              </div>
            )}
          </div>

          {/* Hero Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[520px] relative animate-float shadow-lg rounded-2xl overflow-hidden border border-gray-100">
              <img
                src="./rural2.jpg"
                alt="Village kids using technology"
                className="w-full h-auto object-cover"
              />
              <div className="absolute left-4 top-4 bg-white text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">
                Live Demo
              </div>
            </div>
          </div>
        </section>

        {/* Conditional Content */}
        {isStudent && <StudentHomeContent student={student} />}
        {isTeacher && <TeacherHomeContent teacher={teacher} />}

        {/* Agar koi login nahi hai to generic Features/Testimonials dikhaye */}
        {!isStudent && !isTeacher && (
          <>
            {/* Features */}
            <section className="mt-16">
              <h2 className="text-2xl font-extrabold text-gray-900">
                Features
              </h2>
              <p className="text-gray-600">
                Built for low-connectivity regions, made for real classrooms.
              </p>
            </section>

            {/* Testimonials */}
            <section className="mt-12">
              <h2 className="text-2xl font-extrabold mb-4 text-gray-900">
                What People Say
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <blockquote className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-gray-800 italic">
                    “Connectivity is stable and students are attending from
                    remote villages.”
                  </p>
                  <footer className="mt-3 text-gray-600 text-sm font-semibold">
                    Ramesh Kumar — Principal
                  </footer>
                </blockquote>
                <blockquote className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-gray-800 italic">
                    “Assignments and attendance are automated. Huge time saver.”
                  </p>
                  <footer className="mt-3 text-gray-600 text-sm font-semibold">
                    Ankit Verma — Teacher
                  </footer>
                </blockquote>
              </div>
            </section>
          </>
        )}
      </main>

      <div className="bg-gray-50">
        <Footer />
      </div>

      <AIChatbot />
      {/* <ChatICON /> */}

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes float { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-10px) } }
        .animate-slideUp { animation: slideUp 0.9s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
