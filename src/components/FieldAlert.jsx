import React from "react";

const FieldAlert = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Peringatan</h2>
        <p className="text-sm">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default FieldAlert;
