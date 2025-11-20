import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import API_BASE from '../apiConfig';

const RegisterForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const navigate = useNavigate();

      const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await fetch(`${API_BASE}/api/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password, role, profilePic }),
          });
          if (response.ok) {
            // registration succeeded; redirect to login page
            navigate('/login');
            return;
          }
          // try to parse error details
          const err = await response.json().catch(() => ({}));
          alert(err.error || err.message || 'Registration failed');
        } catch (error) {
          alert("Error occurred", error);
        }
      };
  return (
    <>
      <div className="bg-gray-100 flex h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-white shadow-md rounded-md p-6">
            <img
              className="mx-auto h-12 w-auto"
              src="https://www.svgrepo.com/show/499664/user-happy.svg"
              alt=""
            />
            <h2 className="my-3 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign up for an account
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6" method="POST">
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required=""
                    className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="profilePic"
                    className="block text-sm font-medium text-gray-700">
                    Profile picture URL (optional)
                  </label>
                  <div className="mt-1">
                    <input
                      name="profilePic"
                      id="profilePic"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={profilePic}
                      onChange={(event) => setProfilePic(event.target.value)}
                      className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                    />
                  </div>
                </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required=""
                    className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required=""
                    className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required=""
                    className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <div className="mt-1">
                  <select
                   id="role"
                    type="role"
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    required=""
                    className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                  >
                    <option value="">Select a role</option>
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                  </select>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-sky-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2">
                  Register Account
                </button>
              </div>
            </form>
             <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account ?
                <a
                  href="/login"
                  className="text-blue-600 hover:text-blue-500 font-medium px-2">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
