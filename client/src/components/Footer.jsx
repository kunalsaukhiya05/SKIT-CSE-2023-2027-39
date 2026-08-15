import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div>
        <footer id="contact" className="bg-teal-700 text-white text-center py-6 mt-10">
        <p>© 2025 GyaanSetu. All Rights Reserved.</p>
        <div className="mt-2 space-x-4">
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
          
        </div>
      </footer>
    </div>
  )
}

export default Footer
