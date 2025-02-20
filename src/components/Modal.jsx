// Modal.jsx
import React from 'react';

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null; // Jika modal tidak terbuka, tidak render apa-apa

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">{title}</h2> {/* Menampilkan title dinamis */}
          <button onClick={onClose} className="text-gray-500">X</button>
        </div>
        {children} {/* Konten modal akan di-render di sini */}
      </div>
    </div>
  );
};

export default Modal;
