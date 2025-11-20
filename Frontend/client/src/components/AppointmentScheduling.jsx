// components/AppointmentScheduling.js
import React, { useState, useEffect } from 'react';
import axios from '../axiosInstance';
import API_BASE from '../apiConfig';
import { useAuth } from '../contexts/AuthContext.jsx';
import { FaUser, FaUserMd, FaCalendarAlt, FaClock, FaCheckCircle, FaTimes } from 'react-icons/fa';

const AppointmentScheduling = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  // Edit modal state for doctors/admin/patients
  const [editItem, setEditItem] = useState(null);
  const [editForm] = useState({ patientId: '', doctorId: '', dateTime: '', notes: '', duration: 30, status: 'pending' });

  const [newAppt, setNewAppt] = useState({ patientId: '', doctorId: '', dateTime: '', notes: '', duration: 30, status: 'pending' });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/appointments`);
        const data = response.data;
        // Normalize response: backend may return an array or an object like { appointments: [...] }
        if (Array.isArray(data)) {
          setAppointments(data);
        } else if (data && Array.isArray(data.appointments)) {
          setAppointments(data.appointments);
        } else {
          // Fallback to empty array to avoid crashes when data is not an array
          setAppointments([]);
        }
      } catch (error) {
        console.error('Failed to fetch appointments', error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();

    // if doctor, keep doctorId set for new appointment when user becomes available/changes
    if (user && user.role === 'doctor') {
      setNewAppt((s) => ({ ...s, doctorId: user._id }));
    }
  }, [user]);

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      // normalize dateTime
      const payload = { ...newAppt };
      if (payload.dateTime) payload.dateTime = new Date(payload.dateTime).toISOString();
      const res = await axios.post(`${API_BASE}/api/appointments`, payload, { headers });
      setAppointments((prev) => [res.data, ...prev]);
      setNewAppt({ patientId: '', doctorId: '', dateTime: '', notes: '', duration: 30, status: 'pending' });
    } catch (err) {
      console.error('Failed to create appointment', err);
      alert('Failed to create appointment');
    }
  };

  const _handleSaveEdit = async () => {
    if (!editItem) return;
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const payload = { ...editForm };
      if (payload.dateTime) payload.dateTime = new Date(payload.dateTime).toISOString();
      const res = await axios.put(`${API_BASE}/api/appointments/${editItem._id}`, payload, { headers });
      const updated = res.data;
      setAppointments((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
      setEditItem(null);
    } catch (err) {
      console.error('Failed to save appointment', err);
      alert('Failed to save appointment');
    }
  };
  const handleDelete = async (id) => {
    if (!confirm('Delete this appointment?')) return;
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`${API_BASE}/api/appointments/${id}`, { headers });
      setAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error('Failed to delete appointment', err);
      alert('Failed to delete appointment');
    }
  };

  const handleUpdateStatus = async (apptId, status) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.patch(`${API_BASE}/api/appointments/${apptId}`, { status }, { headers });
      const updated = res.data;
      setAppointments((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
    } catch (err) {
      console.error('Failed to update appointment', err);
      alert('Failed to update appointment');
    }
  };

  // Reschedule modal state
  const [rescheduleAppt, setRescheduleAppt] = useState(null);
  const [rescheduleDateTime, setRescheduleDateTime] = useState('');

  const openReschedule = (appt) => {
    setRescheduleAppt(appt);
    // convert ISO to input datetime-local value if possible
    const dt = appt.dateTime ? new Date(appt.dateTime) : null;
    if (dt) {
      const iso = dt.toISOString().slice(0,16);
      setRescheduleDateTime(iso);
    } else {
      setRescheduleDateTime('');
    }
  };

  const submitReschedule = async () => {
    if (!rescheduleAppt) return;
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const payload = { dateTime: new Date(rescheduleDateTime).toISOString() };
      const res = await axios.patch(`${API_BASE}/api/appointments/${rescheduleAppt._id}`, payload, { headers });
      const updated = res.data;
      setAppointments((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
  setRescheduleAppt(null);
      setRescheduleDateTime('');
    } catch (err) {
      console.error('Failed to reschedule', err);
      alert('Failed to reschedule appointment');
    }
  };

  const statusBadge = (status) => {
    if (!status) return null;
    const s = status.toLowerCase();
    if (s === 'confirmed') return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><FaCheckCircle className="mr-2" />Confirmed</span>;
    if (s === 'pending') return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><FaClock className="mr-2" />Pending</span>;
    return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><FaTimes className="mr-2" />Canceled</span>;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Appointment Scheduling</h1>
      {/* Create appointment panel */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end md:space-x-3">
          <div className="flex-1">
            <label className="text-sm text-gray-600">Patient ID</label>
            <input value={newAppt.patientId} onChange={(e)=>setNewAppt({...newAppt, patientId: e.target.value})} placeholder="patient id" className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div className="flex-1">
            <label className="text-sm text-gray-600">Doctor ID</label>
            <input value={newAppt.doctorId} onChange={(e)=>setNewAppt({...newAppt, doctorId: e.target.value})} placeholder="doctor id" className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div className="flex-1">
            <label className="text-sm text-gray-600">Date & Time</label>
            <input type="datetime-local" value={newAppt.dateTime} onChange={(e)=>setNewAppt({...newAppt, dateTime: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div className="mt-3 md:mt-0">
            <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-md">Create</button>
          </div>
        </div>
        <div className="mt-3">
          <label className="text-sm text-gray-600">Notes</label>
          <textarea value={newAppt.notes} onChange={(e)=>setNewAppt({...newAppt, notes: e.target.value})} placeholder="Optional notes for the appointment" className="w-full mt-2 px-3 py-2 border rounded-md min-h-[80px]" />
        </div>
      </div>
      {loading ? (
        <p className="text-gray-600">Loading appointments...</p>
      ) : (
        <div className="space-y-4">
          {(Array.isArray(appointments) ? appointments : []).length === 0 ? (
            <div className="p-6 bg-white rounded-lg shadow-sm text-center text-gray-600">No appointments found.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {(Array.isArray(appointments) ? appointments : []).map((appt) => (
                <div key={appt._id} className="relative rounded-xl p-4 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md border border-white/10 shadow-md hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <FaUserMd />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Patient</div>
                        <div className="text-base font-medium text-gray-900">{appt.patientName || appt.patientId || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">Doctor: <span className="font-medium text-gray-800">{appt.doctorName || appt.doctorId || 'Unknown'}</span></div>
                      </div>
                    </div>
                    <div className="text-right">
                      {statusBadge(appt.status)}
                      <div className="text-xs text-gray-500 mt-2">{appt.dateTime ? new Date(appt.dateTime).toLocaleString() : '—'}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm text-gray-600">Notes</div>
                    <div className="text-sm text-gray-800">{appt.notes || '—'}</div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FaCalendarAlt />
                      <span>{appt.duration ? `${appt.duration} mins` : 'Duration N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleUpdateStatus(appt._id, 'confirmed')} className="px-3 py-1 rounded-md text-sm bg-green-500 text-white hover:bg-green-600">Confirm</button>
                      <button onClick={() => openReschedule(appt)} className="px-3 py-1 rounded-md text-sm bg-yellow-400 text-white hover:bg-yellow-500">Reschedule</button>
                      <button onClick={() => handleUpdateStatus(appt._id, 'canceled')} className="px-3 py-1 rounded-md text-sm bg-red-400 text-white hover:bg-red-500">Cancel</button>
                      <button onClick={() => handleDelete(appt._id)} className="px-3 py-1 rounded-md text-sm bg-red-600 text-white hover:bg-red-700">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Reschedule Modal */}
      {rescheduleAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setRescheduleAppt(null)} />
          <div className="relative bg-white rounded-lg p-6 w-[90%] max-w-md z-50">
            <h3 className="text-lg font-semibold mb-4">Reschedule Appointment</h3>
            <div className="space-y-3">
              <label className="block text-sm text-gray-700">New date & time</label>
              <input type="datetime-local" value={rescheduleDateTime} onChange={(e) => setRescheduleDateTime(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button onClick={() => setRescheduleAppt(null)} className="px-4 py-2 rounded-md bg-gray-200">Cancel</button>
              <button onClick={submitReschedule} className="px-4 py-2 rounded-md bg-blue-600 text-white">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentScheduling;
