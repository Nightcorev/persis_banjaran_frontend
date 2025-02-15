import React from "react";

const FasilitasTab = () => {
  const data_fasilitas = [
    { id: 1, deskripsi: "Fasilitas olahraga lengkap.", foto: "fasilitas1.jpg" },
    { id: 2, deskripsi: "Ruang kelas modern.", foto: "fasilitas2.jpg" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Data Fasilitas</h2>
      <div className="grid grid-cols-2 gap-4">
        {data_fasilitas.map((fasilitas) => (
          <div key={fasilitas.id} className="bg-white shadow rounded-lg p-4">
            <p className="mb-2">{fasilitas.deskripsi}</p>
            <img src={`/media/images/fasilitas/${fasilitas.foto}`} alt="Fasilitas" className="w-full h-48 object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FasilitasTab;
