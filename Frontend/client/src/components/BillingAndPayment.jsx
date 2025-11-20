// components/BillingAndPayment.js
import React, { useState, useEffect } from 'react';
import axios from '../axiosInstance';
import API_BASE from '../apiConfig';
import { FaUniversity, FaMobileAlt, FaMoneyBillWave, FaDownload, FaSearch } from 'react-icons/fa';

const BillingAndPayment = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterMethod, setFilterMethod] = useState('all');
  const [filterPaid, setFilterPaid] = useState('all');
  const [query, setQuery] = useState('');
  const [modalBill, setModalBill] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/billing`);
        const data = response.data;
        // Normalize response: backend may return an array or an object like { bills: [...] }
        if (Array.isArray(data)) {
          setBills(data);
        } else if (data && Array.isArray(data.bills)) {
          setBills(data.bills);
        } else {
          setBills([]);
          console.warn('Unexpected /api/bills response shape', data);
        }
      } catch (error) {
        console.error('Failed to fetch bills', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  const paymentBadge = (method) => {
    const m = (method || '').toLowerCase();
    if (m.includes('mpesa') || m.includes('m-pesa') || m.includes('mpesa')) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-400 to-green-600 text-white">
          <FaMobileAlt className="mr-2" /> M-Pesa
        </span>
      );
    }
    if (m.includes('bank') || m.includes('transfer') || m.includes('card')) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-400 to-blue-600 text-white">
          <FaUniversity className="mr-2" /> Bank
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800">
        <FaMoneyBillWave className="mr-2" /> {method || 'Unknown'}
      </span>
    );
  };

  const handleMarkPaid = async (bill, method = 'Bank') => {
    try {
      // PATCH the bill to set paid=true and paymentMethod
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.patch(`${API_BASE}/api/billing/${bill._id}`, { paid: true, paymentMethod: method }, { headers });
      const updated = res.data;
      setBills((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
    } catch (err) {
      console.error('Failed to mark paid', err);
      alert('Failed to mark bill as paid');
    }
  };

  const openInvoice = async (bill) => {
    // open modal with bill details (we already have bill)
    setModalBill(bill);
  };

  const downloadInvoicePDF = async (bill) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${API_BASE}/api/billing/${bill._id}/invoice`, { responseType: 'blob', headers });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${bill._id || 'invoice'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download PDF', err);
      alert('Failed to download invoice PDF');
    }
  };

  const filtered = (Array.isArray(bills) ? bills : []).filter((bill) => {
    if (filterMethod !== 'all' && ((bill.paymentMethod || '').toLowerCase() !== filterMethod)) return false;
    if (filterPaid !== 'all') {
      const isPaid = !!bill.paid;
      if (filterPaid === 'paid' && !isPaid) return false;
      if (filterPaid === 'unpaid' && isPaid) return false;
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      const match = (bill.patientId || bill.patient || '').toString().toLowerCase().includes(q) || (bill._id || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Billing & Payment</h1>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center bg-white rounded-md px-3 py-2 shadow-sm">
          <FaSearch className="text-gray-400 mr-2" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by patient ID or bill ID" className="outline-none text-sm" />
        </div>
        <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)} className="px-3 py-2 rounded-md">
          <option value="all">All Methods</option>
          <option value="mpesa">M-Pesa</option>
          <option value="bank">Bank</option>
        </select>
        <select value={filterPaid} onChange={(e) => setFilterPaid(e.target.value)} className="px-3 py-2 rounded-md">
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      {loading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map((i) => (
            <div key={i} className="animate-pulse p-5 rounded-xl bg-gray-100 h-44" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((bill) => (
            <div key={bill._id} className="relative rounded-xl p-5 bg-white/50 backdrop-blur-md border border-white/10 shadow-md hover:shadow-xl transition-shadow duration-250">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Bill #{(bill._id || '').slice ? (bill._id || '').slice(-6) : bill._id}</h3>
                  <p className="text-sm text-gray-500">Patient: <span className="font-medium text-gray-800">{bill.patientId || bill.patient || 'Unknown'}</span></p>
                </div>
                <div className="text-right">
                  <div>{paymentBadge(bill.paymentMethod)}</div>
                  <div className="mt-2 text-sm text-gray-500">{bill.date ? new Date(bill.date).toLocaleDateString() : ''}</div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">Services:</p>
                {Array.isArray(bill.services) ? (
                  <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                    {bill.services.map((s, i) => (
                      <li key={i}>{typeof s === 'string' ? s : s.name || JSON.stringify(s)}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-gray-700">{bill.services || '—'}</p>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Total</div>
                  <div className="text-xl font-bold text-gray-900">${bill.total ?? bill.amount ?? '0.00'}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <button onClick={() => openInvoice(bill)} className="flex items-center px-4 py-2 rounded-md bg-purple-600 text-white text-sm hover:bg-purple-700 transition"><FaDownload className="mr-2" />Invoice</button>
                  {!bill.paid ? (
                    <button onClick={() => handleMarkPaid(bill, 'Bank')} className="px-4 py-2 rounded-md bg-green-500 text-white text-sm hover:bg-green-600 transition">Mark Paid</button>
                  ) : (
                    <div className="text-sm font-medium text-green-700">Paid</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      {modalBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalBill(null)} />
          <div className="relative bg-white rounded-lg p-6 w-[90%] max-w-2xl z-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Invoice #{(modalBill._id || '').slice ? (modalBill._id || '').slice(-8) : modalBill._id}</h3>
              <button onClick={() => setModalBill(null)} className="text-gray-500">Close</button>
            </div>
            <div className="mt-4">
              <p><strong>Patient:</strong> {modalBill.patientId || modalBill.patient}</p>
              <p><strong>Services:</strong></p>
              {Array.isArray(modalBill.services) ? (
                <ul className="list-disc list-inside mt-2">
                  {modalBill.services.map((s,i) => <li key={i}>{typeof s==='string'?s:s.name||JSON.stringify(s)}</li>)}
                </ul>
              ) : (
                <p className="mt-2">{modalBill.services}</p>
              )}
              <p className="mt-3"><strong>Total:</strong> ${modalBill.total}</p>
              <p className="mt-1"><strong>Payment Method:</strong> {modalBill.paymentMethod || '—'}</p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => downloadInvoicePDF(modalBill)} className="px-4 py-2 rounded-md bg-blue-600 text-white">Download PDF</button>
              {!modalBill.paid && <button onClick={() => { handleMarkPaid(modalBill); setModalBill(null); }} className="px-4 py-2 rounded-md bg-green-600 text-white">Mark Paid</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingAndPayment;
