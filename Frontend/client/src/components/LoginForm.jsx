// components/LoginForm.jsx
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import API_BASE from '../apiConfig';
import { useAuth } from '../contexts/AuthContext.jsx';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.token) {
        // prefer context login when available
        if (auth && typeof auth.login === 'function') {
          await auth.login(data.token);
        } else {
          localStorage.setItem("token", data.token);
          if (typeof onLogin === 'function') onLogin(true);
        }
        navigate('/');
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      alert("Error occurred", error);
    }
  };
  return (
    <>
      <div className="bg-gray-100 flex h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-md w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
             
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
              required=""
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required=""
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150">
            Sign In
          </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account ?
                <a
                  href="/register"
                  className="text-blue-600 hover:text-blue-500 font-medium px-2">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginForm;
