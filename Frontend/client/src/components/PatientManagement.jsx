// components/PatientManagement.js
import React, { useState, useEffect } from "react";
import axios from '../axiosInstance';
import API_BASE from '../apiConfig';
const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPatients = async () => {
      try {
  const response = await axios.get(`${API_BASE}/api/patients`);
        const data = response.data;
        // Normalize response: accept either an array or { patients: [...] }
        if (Array.isArray(data)) {
          setPatients(data);
        } else if (data && Array.isArray(data.patients)) {
          setPatients(data.patients);
        } else {
          setPatients([]);
          console.warn("Unexpected /api/patients response shape", data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch patients", error);
        alert("Error occurred while fetching patients");
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Patient Management</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date of Birth
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    UNIQUE ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(Array.isArray(patients) ? patients : []).map((patient) => (
                <tr key={patient._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {patient.profilePic ? (
                      <img
                        src={patient.profilePic}
                        alt={`${patient.name || 'Patient'} avatar`}
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/40?text=No+Img';
                        }}
                      />
                    ) : (
                      <img
                        src={'https://via.placeholder.com/40?text=No+Img'}
                        alt="no avatar"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {patient.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {patient.dob}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {patient.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {patient.contact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {patient._id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default PatientManagement;
