import React from "react";
import { Link } from "react-router-dom";
import { GrUserManager } from "react-icons/gr";

export default function TeacherHomeContent({ teacher }) {
  return (
    <div className="mt-12 space-y-16">
      {/* Welcome Section */}
      <section className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center gap-4">
          Welcome, {teacher?.fullName || "Teacher"} <GrUserManager />
        </h2>
        <p className="text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
          Empower rural education with technology.  
          Manage classes, engage with students, and grow your teaching career with GyaanSetu.
        </p>
        <div className="mt-6">
          <Link
            to="/teacher-dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition"
          >
            Go to Dashboard →
          </Link>
        </div>
      </section>

      {/* Key Features */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Tools to Make Teaching Easier
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h4 className="font-semibold text-blue-600">🎥 Host Live Classes</h4>
            <p className="text-gray-600 mt-2 text-sm">
              Start interactive video sessions with screen share, chat, polls & hand-raise features.  
              Optimized for low bandwidth so every student can join.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h4 className="font-semibold text-blue-600">📑 Assign & Evaluate</h4>
            <p className="text-gray-600 mt-2 text-sm">
              Create assignments & quizzes, auto-evaluate submissions, and give personalized feedback.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h4 className="font-semibold text-blue-600">📊 Attendance & Reports</h4>
            <p className="text-gray-600 mt-2 text-sm">
              Attendance is auto-marked. Access detailed reports to identify students who need extra support.
            </p>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Why GyaanSetu for Teachers?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-gray-700 leading-relaxed">
              📌 Teachers in rural colleges face challenges like:  
            </p>
            <ul className="mt-4 space-y-2 text-gray-700 list-disc list-inside">
              <li>Unreliable internet during online classes</li>
              <li>Difficulty in tracking student engagement</li>
              <li>Manual effort in marking attendance & grading</li>
              <li>Lack of recognition for their teaching efforts</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h4 className="text-blue-600 font-semibold mb-2">
              GyaanSetu helps by:
            </h4>
            <p className="text-gray-700 text-sm">
               <br />* Stable low-bandwidth video conferencing  
               <br />* Automated attendance & grading system  
               <br />* Centralized dashboard for resources & reports  
               <br />* Greater visibility & recognition for your teaching  
            </p>
          </div>
        </div>
      </section>

      {/* Highlight Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-2xl p-10 shadow-lg">
        <h3 className="text-3xl font-extrabold mb-4 text-center">
           Take Your Teaching to the Next Level
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-white/10 rounded-xl">
            <h4 className="font-semibold">🌍 Reach More Students</h4>
            <p className="mt-2 text-sm opacity-90">
              Connect with students from multiple rural colleges at once.
            </p>
          </div>
          <div className="p-6 bg-white/10 rounded-xl">
            <h4 className="font-semibold">🤖 AI Insights</h4>
            <p className="mt-2 text-sm opacity-90">
              Get AI-powered analytics on student performance & engagement.
            </p>
          </div>
          <div className="p-6 bg-white/10 rounded-xl">
            <h4 className="font-semibold">🏆 Recognition & Growth</h4>
            <p className="mt-2 text-sm opacity-90">
              Build your digital teaching profile and grow your career.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center mt-12">
        <h3 className="text-2xl font-extrabold text-gray-900">
          Ready to inspire your students?
        </h3>
        <p className="text-gray-600 mt-2">
          Start hosting live classes and make an impact in rural education.
        </p>
        <div className="mt-6">
          <Link
            to="/teacher-dashboard"
            className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-600 transition"
          >
            Go to Teacher Dashboard →
          </Link>
        </div>
      </section>
    </div>
  );
}
