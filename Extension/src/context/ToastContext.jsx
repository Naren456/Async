import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 w-max max-w-[90%] pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              animate-fade-in px-4 py-2 rounded-xl shadow-lg backdrop-blur-md border text-sm font-medium flex items-center gap-2
              ${toast.type === 'success' ? 'bg-green-500/20 border-green-500/30 text-green-100' : ''}
              ${toast.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-100' : ''}
              ${toast.type === 'info' ? 'bg-blue-500/20 border-blue-500/30 text-blue-100' : ''}
            `}
          >
            {toast.type === 'success' && <span>✅</span>}
            {toast.type === 'error' && <span>❌</span>}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
