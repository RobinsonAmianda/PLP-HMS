import React, { useState, useEffect } from 'react';
import axios from '../axiosInstance';
import API_BASE from '../apiConfig';
import { useAuth } from '../contexts/AuthContext.jsx';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', role: '', password: '', profilePic: '' });
  const [preview, setPreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', role: user.role || '', password: '', profilePic: user.profilePic || '' });
      setPreview(user.profilePic || '');
    }
  }, [user]);

  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    try {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } catch {
      setPreview('');
    }
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      let profilePicUrl = form.profilePic;
      // if a file was selected upload it first
      if (selectedFile) {
        const fd = new FormData();
        fd.append('avatar', selectedFile);
        const up = await axios.post(`/api/users/${user._id}/avatar`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        // backend returns { profilePic, user }
        if (up && up.data && up.data.profilePic) profilePicUrl = up.data.profilePic;
      }
      const payload = { name: form.name };
      if (form.password) payload.password = form.password;
      if (profilePicUrl) payload.profilePic = profilePicUrl;
      const res = await axios.put(`/api/users/${user._id}`, payload);
      // update context and cached user
      if (res && res.data) updateUser(res.data);
      alert('Profile updated');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div className="p-6">Loading profile...</div>;

  const previewUrl = preview ? (preview.startsWith('/uploads') ? API_BASE + preview : preview) : '';

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
      <div className="bg-white shadow rounded p-6">
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-28 h-28">
              <img src={previewUrl || 'https://www.gravatar.com/avatar/?d=mp&s=200'} alt="avatar" className="w-28 h-28 rounded-full object-cover" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Change avatar</label>
              <input type="file" accept="image/*" onChange={onFile} className="mt-2" />
              <p className="text-xs text-gray-500 mt-2">PNG/JPG up to 2MB. Image will be uploaded to the server.</p>
            </div>
            <div className="ml-auto text-right">
              <div className="inline-block bg-blue-600 text-white px-2 py-1 rounded text-sm">{user.role}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input name="email" value={form.email} readOnly className="mt-1 block w-full border rounded px-3 py-2 bg-gray-50" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">New password (leave blank to keep)</label>
            <input name="password" value={form.password} onChange={handleChange} type="password" className="mt-1 block w-full border rounded px-3 py-2" />
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60">{saving ? 'Saving...' : 'Save changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
