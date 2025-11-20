import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import AppointmentScheduling from "./components/AppointmentScheduling.jsx"
import BillingAndPayment from "./components/BillingAndPayment.jsx"
import DoctorManagement from "./components/DoctorManagement.jsx"
import LoginForm from "./components/LoginForm.jsx"
import Navbar from "./components/Navbar.jsx"
import PatientManagement from "./components/PatientManagement.jsx"
import Home from "./components/Home.jsx" 
import RegisterForm from './components/RegisterForm.jsx'
import UsersManagement from './components/UsersManagement.jsx'
import Profile from './components/Profile.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import ToastProvider from './components/ToastProvider.jsx'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'


function InnerRoutes() {
  const { user } = useAuth();
  const isAuth = Boolean(user);
  return (
    <Router>
      {isAuth && <Navbar onLogout={() => { /* logout handled in Navbar via context */ }} />}
      <Routes>
        {!isAuth && (
          <>
            <Route path="/" element={<LoginForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}

        {isAuth && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/appointments" element={<AppointmentScheduling />} />
            <Route path="/payments" element={<BillingAndPayment />} />
            <Route path="/doctors" element={<DoctorManagement />} />
            <Route path="/users" element={<UsersManagement />} />
            <Route path="/patients" element={<PatientManagement />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <>
      <ToastProvider>
        <AuthProvider>
          <InnerRoutes />
        </AuthProvider>
      </ToastProvider>
    </>
  );
}

export default App
