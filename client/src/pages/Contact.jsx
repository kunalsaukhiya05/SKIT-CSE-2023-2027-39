import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const Contact = () => {
  return (
     <div className="min-h-screen bg-gray-50 font-sans">
     <Header />

      {/* Hero Section */}
      <section className="px-6 md:px-20 py-12 text-center bg-gray-100">
        <h2 className="text-3xl md:text-4xl font-bold text-teal-700 mb-4">
          Contact Us
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Have questions or want to connect with us?  
          Reach out anytime we’d love to hear from you!
        </p>
      </section>

      {/* Contact Form + Info */}
      <section className="px-6 md:px-20 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="bg-white shadow-lg rounded-xl p-8 hover:shadow-xl transition">
          <h3 className="text-2xl font-semibold text-teal-600 mb-6">
            📩 Send us a Message
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Message</label>
              <textarea
                placeholder="Write your message..."
                rows="4"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="bg-white shadow-lg rounded-xl p-8 hover:shadow-xl transition flex flex-col justify-center">
          <h3 className="text-2xl font-semibold text-teal-600 mb-6">
            📞 Contact Information
          </h3>
          <p className="text-gray-700 mb-4">
            <strong>Contact: </strong> Kunal Saukhiya
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Email: </strong>  
            <Link to="mailto:kunalsaukhiya@gmail.com" className="text-teal-600 hover:underline">
              kunalsaukhiya@gmail.com
            </Link>
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Institution: </strong> SKIT Jaipur, Rajasthan
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Address: </strong>  
            Jaipur, Rajasthan, India
          </p>
          <p className="text-gray-600 text-sm mt-4">
            We usually reply within 24 hours
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Contact
