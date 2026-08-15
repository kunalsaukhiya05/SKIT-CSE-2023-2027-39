import React from 'react'
import { Link } from 'react-router-dom'

const StudentDashboardHeader = () => {
  return (
    <div>
       <header className="bg-teal-700 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-lg md:text-2xl font-bold">Student Dashboard</h1>
        <nav className="space-x-4">
          <Link to="/student-dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/student-profile" className="hover:underline">Profile</Link>
          <Link to="#" className="hover:underline">Logout</Link>
        </nav>
      </header>
    </div>
  )
}

export default StudentDashboardHeader
