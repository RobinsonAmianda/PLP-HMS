// components/UsersManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from '../axiosInstance';
import API_BASE from '../apiConfig';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
  const response = await axios.get(`${API_BASE}/api/users`);
        const data = response.data;
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setUsers([]);
          console.warn('Unexpected /api/users response shape', data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch users', error);
        alert('Error occurred while fetching users');
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Users</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pic</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(Array.isArray(users) ? users : []).map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={`${user.name || 'User'} avatar`}
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/40?text=No+Img'; }}
                      />
                    ) : (
                      <img src={'https://via.placeholder.com/40?text=No+Img'} alt="no avatar" className="h-10 w-10 rounded-full object-cover" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
