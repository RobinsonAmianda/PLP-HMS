// components/DoctorManagement.js
import React, { useState, useEffect } from 'react';
import axios from '../axiosInstance';
import API_BASE from '../apiConfig';
const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/doctors`);
        const data = response.data;
        // Normalize response: backend may return an array or an object like { doctors: [...] }
        if (Array.isArray(data)) {
          setDoctors(data);
        } else if (data && Array.isArray(data.doctors)) {
          setDoctors(data.doctors);
        } else {
          setDoctors([]);
          console.warn('Unexpected /api/doctors response shape', data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch doctors', error);
        alert('Error occurred while fetching doctors');
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Doctor Management</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {(Array.isArray(doctors) ? doctors : []).map((doctor) => (
            <div
              key={doctor._id}
              className="relative rounded-xl p-6 bg-white/40 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {doctor.profilePic ? (
                    <img
                      src={doctor.profilePic}
                      alt={`${doctor.name || 'Doctor'} avatar`}
                      className="h-16 w-16 rounded-full object-cover ring-2 ring-white/30"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/64?text=No+Img';
                      }}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" fill="#9CA3AF"/>
                        <path d="M4 20c0-3.314 2.686-6 6-6h4c3.314 0 6 2.686 6 6v1H4v-1z" fill="#D1D5DB"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-gray-500">{doctor.email}</p>
                  <p className="text-sm text-gray-500">{doctor.contact}</p>
                  <p className="text-sm text-gray-500">{doctor._id}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">Experience</span>
                <span className="text-sm font-medium text-gray-900">{doctor.experience} yrs</span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 line-clamp-2">{doctor.specialty || doctor.specialization || ''}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default DoctorManagement;
