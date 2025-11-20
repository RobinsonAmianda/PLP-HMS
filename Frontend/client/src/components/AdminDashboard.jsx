import React, { useState, useEffect } from 'react';
import axios from '../axiosInstance';
import { useAuth } from '../contexts/AuthContext.jsx';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('users');
  const [lists, setLists] = useState({ users: [], doctors: [], patients: [], appointments: [], bills: [] });
  const [loading, setLoading] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editPayload, setEditPayload] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') return; // only admin
    fetchAll();
    
  }, [user, tab]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [u, d, p, a, b] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/doctors'),
        axios.get('/api/patients'),
        axios.get('/api/appointments'),
        axios.get('/api/billing'),
      ]);
      setLists({ users: u.data, doctors: d.data, patients: p.data, appointments: a.data, bills: b.data });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resource, id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await axios.delete(`/api/${resource}/${id}`);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  const handleView = (item) => {
    setModalItem(item);
  };

  const handleOpenEdit = (item) => {
    setModalItem(item);
    setEditPayload(JSON.stringify(item, null, 2));
    setShowEdit(true);
  };

  const handleSaveEdit = async () => {
    if (!modalItem) return;
    try {
      const resource = tab === 'bills' ? 'billing' : tab;
      const parsed = JSON.parse(editPayload);
      await axios.put(`/api/${resource}/${modalItem._id}`, parsed);
      setShowEdit(false);
      setModalItem(null);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert('Failed to save changes. Make sure JSON is valid and you have permissions.');
    }
  };

  const handleCreateNew = () => {
    setModalItem(null);
    setEditPayload('');
    setShowEdit(true);
  };

  const handleSaveNew = async () => {
    try {
      const resource = tab === 'bills' ? 'billing' : tab;
      const parsed = JSON.parse(editPayload);
      await axios.post(`/api/${resource}`, parsed);
      setShowEdit(false);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert('Failed to create. Ensure JSON is valid and you have permissions.');
    }
  };

  const renderList = () => {
    const items = lists[tab] || [];
    if (!items.length) return <div className="p-6 text-gray-500">No items</div>;
    return (
      <div className="grid grid-cols-1 gap-3">
        {items.map((it) => (
          <div key={it._id} className="p-3 bg-white shadow rounded flex items-center justify-between">
            <div>
              <div className="font-semibold">{it.name || it.email || (it.patientName || '') || it._id}</div>
              <div className="text-sm text-gray-500">{it.email || it.contact || (it.patientId || '')}</div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => handleView(it)} className="px-3 py-1 rounded bg-gray-100">View</button>
              <button onClick={() => handleOpenEdit(it)} className="px-3 py-1 rounded bg-yellow-400">Edit</button>
              <button onClick={() => handleDelete(tab === 'users' ? 'users' : tab === 'doctors' ? 'doctors' : tab === 'patients' ? 'patients' : tab === 'appointments' ? 'appointments' : 'billing', it._id)} className="px-3 py-1 rounded bg-red-500 text-white">Delete</button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Modal and edit UI
  const renderModal = () => {
    if (!modalItem) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={() => setModalItem(null)} />
        <div className="relative bg-white rounded-lg p-6 w-[90%] max-w-2xl z-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Details</h3>
            <button onClick={() => setModalItem(null)} className="text-gray-500">Close</button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2">
            {Object.entries(modalItem).map(([k,v]) => (
              <div key={k} className="flex justify-between border-b py-2">
                <div className="text-sm text-gray-600 font-medium">{k}</div>
                <div className="text-sm text-gray-800">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderEditPanel = () => {
    if (!showEdit) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={() => setShowEdit(false)} />
        <div className="relative bg-white rounded-lg p-6 w-[95%] max-w-3xl z-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{modalItem ? 'Edit Item' : 'Create New'}</h3>
            <button onClick={() => setShowEdit(false)} className="text-gray-500">Close</button>
          </div>
          <textarea value={editPayload} onChange={(e)=>setEditPayload(e.target.value)} className="w-full h-72 mt-4 p-3 border rounded-md font-mono text-sm" placeholder='Enter JSON representation' />
          <div className="mt-4 flex justify-end space-x-2">
            {modalItem ? (
              <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-600 text-white rounded-md">Save</button>
            ) : (
              <button onClick={handleSaveNew} className="px-4 py-2 bg-green-600 text-white rounded-md">Create</button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!user) return <div className="p-6">Loading...</div>;
  if (user.role !== 'admin') return <div className="p-6 text-red-500">Access denied</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
      <div className="flex space-x-2 mb-4">
        {['users','doctors','patients','appointments','bills'].map((t) => (
          <button key={t} onClick={() => setTab(t === 'bills' ? 'bills' : t)} className={`px-3 py-2 rounded ${tab===t ? 'bg-blue-600 text-white' : 'bg-white shadow'}`}>{t.toUpperCase()}</button>
        ))}
      </div>
      <div className="flex items-center justify-between mb-3">
        <div />
        <div>
          <button onClick={handleCreateNew} className="px-3 py-2 bg-green-600 text-white rounded">Create New</button>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded">
        {loading ? <div className="p-6 text-gray-500">Loading...</div> : renderList()}
      </div>
      {renderModal()}
      {renderEditPanel()}
    </div>
  );
};

export default AdminDashboard;
