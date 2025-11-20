import React, { useEffect, useState } from 'react';
import { subscribe } from '../toastService';

const ToastItem = ({ toast, onClose }) => {
  const { id, type, message } = toast;
  useEffect(() => {
    const t = setTimeout(() => onClose(id), 4000);
    return () => clearTimeout(t);
  }, [id, onClose]);
  const bg = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  return (
    <div className={`${bg} text-white px-4 py-2 rounded shadow`}>{message}</div>
  );
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsub = subscribe((t) => {
      const id = Date.now() + Math.random();
      setToasts((s) => [...s, { id, ...t }]);
    });
    return unsub;
  }, []);

  const remove = (id) => setToasts((s) => s.filter((t) => t.id !== id));

  return (
    <>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={remove} />
        ))}
      </div>
    </>
  );
};

export default ToastProvider;
