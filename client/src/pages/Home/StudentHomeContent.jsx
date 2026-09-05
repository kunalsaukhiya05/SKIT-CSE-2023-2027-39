import React from "react";
import { Link } from "react-router-dom";
import { PiStudentBold } from "react-icons/pi";

export default function StudentHomeContent({ student }) {
  return (
    <div className="mt-12 space-y-16">
      {/* Welcome Section */}
      <section className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center gap-4">
          Welcome, {student?.fullName || "Student"} <span><PiStudentBold /></span>
        </h2>
        <p className="text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
          GyaanSetu is built to bring quality education to rural colleges.  
          Join live classes, access resources offline, and track your progress seamlessly.
        </p>
        <div className="mt-6">
          <Link
            to="/student-dashboard"
            className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-teal-700 transition"
          >
            Go to Dashboard →
          </Link>
        </div>
      </section>

      {/* Key Features */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          What You’ll Get as a Student
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h4 className="font-semibold text-teal-600">📚 Live & Upcoming Classes</h4>
            <p className="text-gray-600 mt-2 text-sm">
              Join interactive video sessions with your teachers.  
              Get reminders for upcoming classes so you never miss learning.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h4 className="font-semibold text-teal-600">📝 Assignments & Tests</h4>
            <p className="text-gray-600 mt-2 text-sm">
              Complete assignments online, submit tests digitally, and view instant evaluations.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h4 className="font-semibold text-teal-600">📊 Attendance & Reports</h4>
            <p className="text-gray-600 mt-2 text-sm">
              Your attendance is marked automatically during classes.  
              Download reports anytime for your progress tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Problem Statement & Solution */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Why GyaanSetu?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-gray-700 leading-relaxed">
              Many students in rural areas face challenges like poor internet,
              lack of resources, and limited access to teachers.  
              GyaanSetu solves these problems with:
            </p>
            <ul className="mt-4 space-y-2 text-gray-700 list-disc list-inside">
              <li>Low-bandwidth live classes that work even on 2G/3G</li>
              <li>Offline-friendly study resources (notes, PDFs, videos)</li>
              <li>Automatic attendance & progress reports</li>
              <li>Multilingual support for better understanding</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h4 className="text-teal-600 font-semibold mb-2">
              How it helps you:
            </h4>
            <p className="text-gray-700 text-sm">
              - No need to worry about missing classes.  
              - Learn in your own language.  
              - Revise anytime with downloadable notes.  
              - Stay motivated by tracking your growth.
            </p>
          </div>
        </div>
      </section>

      {/* NEW Highlight Section */}
      <section className="bg-gradient-to-r from-teal-600 to-sky-500 text-white rounded-2xl p-10 shadow-lg">
        <h3 className="text-3xl font-extrabold mb-4 text-center">
          Next-Gen Learning Experience
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-white/10 rounded-xl">
            <h4 className="font-semibold">🎥 Live Video Conferencing</h4>
            <p className="mt-2 text-sm opacity-90">
              Real-time interactive classrooms with screen share, chat, and hand-raise feature.
            </p>
          </div>
          <div className="p-6 bg-white/10 rounded-xl">
            <h4 className="font-semibold">🏫 For Rural Colleges & Tier-3 Cities</h4>
            <p className="mt-2 text-sm opacity-90">
              Designed to work on low bandwidth so that no student is left behind, even in remote areas.
            </p>
          </div>
          <div className="p-6 bg-white/10 rounded-xl">
            <h4 className="font-semibold">🤖 AI Voice Translator</h4>
            <p className="mt-2 text-sm opacity-90">
              Ask your queries in any language — our real-time AI model translates for better understanding.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Benefits for Students
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-teal-600 font-semibold">🌐 Low Data Mode</h4>
            <p className="text-sm text-gray-600 mt-2">
              Save internet data with optimized video quality.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-teal-600 font-semibold">📥 Offline Notes</h4>
            <p className="text-sm text-gray-600 mt-2">
              Download notes & videos to study without internet.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-teal-600 font-semibold">🌍 Multi-language</h4>
            <p className="text-sm text-gray-600 mt-2">
              Learn in English, Hindi, or regional languages.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-teal-600 font-semibold">⏱ Flexible Learning</h4>
            <p className="text-sm text-gray-600 mt-2">
              Missed a class? Access recorded lectures anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center mt-12">
        <h3 className="text-2xl font-extrabold text-gray-900">
          Ready to start your learning journey?
        </h3>
        <p className="text-gray-600 mt-2">
          Access your dashboard for classes, resources, and more.
        </p>
        <div className="mt-6">
          <Link
            to="/student-dashboard"
            className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:from-teal-700 hover:to-teal-600 transition"
          >
            Go to Student Dashboard →
          </Link>
        </div>
      </section>
    </div>
  );
}
