import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
     <Header />
      {/* Hero Section */}
      <section className="px-6 md:px-20 py-12 text-center bg-gray-100">
        <h2 className="text-3xl md:text-4xl font-bold text-teal-700 mb-4">
          About Remote Classroom
        </h2>
        <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
          Remote Classroom for Rural Colleges is a digital platform designed to 
          bridge the education gap in rural areas. We bring teachers and students 
          together through live online classrooms, interactive learning tools, 
          and accessible resources ensuring quality education for everyone, 
          anytime, anywhere.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="px-6 md:px-20 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white shadow-lg rounded-xl p-8 hover:shadow-xl transition">
          <h3 className="text-2xl font-semibold text-teal-600 mb-3">🎯 Our Mission</h3>
          <p className="text-gray-600">
            To make education affordable, accessible, and effective for rural 
            students by connecting them to qualified teachers through 
            technology-driven classrooms.
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-8 hover:shadow-xl transition">
          <h3 className="text-2xl font-semibold text-teal-600 mb-3">🌍 Our Vision</h3>
          <p className="text-gray-600">
            A future where location is no barrier to learning empowering 
            rural communities with the same opportunities as urban students.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-20 py-12 text-center bg-gray-100">
        <h3 className="text-2xl md:text-3xl font-semibold text-teal-700 mb-8">
          Why Choose Remote Classroom?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { title: "Live Classes", desc: "Interactive real-time learning" },
            { title: "Resources", desc: "Study notes, PDFs, and videos" },
            { title: "Assignments", desc: "Upload & submit with deadlines" },
            { title: "Multi-Language", desc: "Supports Hindi + English" },
            { title: "Affordable", desc: "No costly setups, just mobile & internet" },
            { title: "Inclusive", desc: "Empowering rural communities" },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition"
            >
              <h4 className="text-lg font-semibold text-teal-600">{f.title}</h4>
              <p className="text-gray-600 mt-2 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="px-6 md:px-20 py-12 text-center">
        <h3 className="text-2xl md:text-3xl font-semibold text-teal-700 mb-2">
          Meet Our Project Team
        </h3>
        <p className="text-gray-500 text-sm mb-8">SKIT Jaipur • Computer Science & Engineering (2023–2027) • Group 39</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { name: "Kunal Saukhiya", role: "Team Lead — Backend & APIs", initials: "KS" },
            { name: "Manish Kumar", role: "Frontend & UI/UX Development", initials: "MK" },
            { name: "Manish Regar", role: "Database & AI Services", initials: "MR" },
            { name: "Rishabh Jain", role: "Testing & Deployment", initials: "RJ" },
          ].map((member, i) => (
            <div
              key={i}
              className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition border border-teal-50"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-xl font-bold text-white shadow-md">
                {member.initials}
              </div>
              <h4 className="text-lg font-bold text-gray-800">{member.name}</h4>
              <p className="text-teal-600 font-medium text-xs mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default About
