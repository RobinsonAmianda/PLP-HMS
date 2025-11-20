// import React, { useState } from 'react';
import { FaStethoscope, FaUserMd, FaCalendarCheck, FaEnvelope,  } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from '../apiConfig';

const Home = () => {
  const [email, setEmail] = useState('');

  const categories = [
    { 
      icon: <FaStethoscope className="text-4xl text-blue-600" />, 
      title: "General Checkup", 
      description: "Comprehensive health assessment" 
    },
    { 
      icon: <FaUserMd className="text-4xl text-green-600" />, 
      title: "Specialist Consultation", 
      description: "Expert medical advice" 
    },
        { 
      icon: <FaCalendarCheck className="text-4xl text-red-600" />, 
      title: "Clinic Services", 
      description: "Assesing different Problems " 
    },
   
    // Add more categories
  ];

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
  const res = await axios.get(`${API_BASE}/api/doctors`);
        const data = res.data;
        if (Array.isArray(data)) setDoctors(data);
        else if (data && Array.isArray(data.doctors)) setDoctors(data.doctors);
        else {
          console.warn('Unexpected /api/doctors response shape', data);
          setDoctors([]);
        }
      } catch (err) {
        console.error('Failed to fetch doctors', err);
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Newsletter submission logic
    console.log('Submitted:', email);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 h-96 flex items-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Your Health, Our Priority
          </h1>
          <p className="text-xl mb-8">
            Comprehensive healthcare solutions tailored to your needs
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-blue-100 transition">
            Book Appointment
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Medical Services
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition">
              <div className="flex justify-center mb-4">
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
              <p className="text-gray-600">{category.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Doctors Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet Our Doctors
          </h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {loadingDoctors ? (
              <p>Loading doctors...</p>
            ) : (
              (Array.isArray(doctors) ? doctors : []).map((doctor, idx) => (
                <div
                  key={doctor._id || idx}
                  className="relative rounded-xl p-6 bg-white/40 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="h-48 w-full rounded-lg overflow-hidden">
                    {doctor.profilePic || doctor.image ? (
                      <img
                        src={doctor.profilePic || doctor.image}
                        alt={doctor.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center mt-4">
                    <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-gray-600">{doctor.specialty || doctor.specialization}</p>
                    <p className="text-sm text-gray-500 mt-2">{doctor.email}</p>
                    <p className="text-sm text-gray-500">{doctor.contact}</p>
                    <div className="mt-3 flex items-center justify-center">
                      <span className="text-sm text-gray-600 mr-2">Experience:</span>
                      <span className="text-sm font-medium text-gray-900">{doctor.experience || 'N/A'} yrs</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-blue-400 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated with Our Newsletter
          </h2>
          <p className="mb-8 text-xl">
            Get the latest health tips and medical insights
          </p>
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-4 py-3 rounded-l-lg text-gray-600"
            />
            <button 
              type="submit" 
              className="bg-white text-blue-600 px-6 py-3 rounded-r-lg hover:bg-blue-100"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AfyaBora</h3>
            <p>Providing quality healthcare solutions</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul>
              <li>Home</li>
              <li>Services</li>
              <li>Doctors</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <p>Email: support@afyabora.com</p>
            <p>Phone: +254 123 456 7890</p>
          </div>
        </div>
        <div className="text-center mt-8 border-t border-gray-700 pt-4">
          © 2023 AfyaBora. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;