import React from 'react';

const Fasilitas = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Title */}
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">Fasilitas PC Persis Banjaran</h1>
      
      {/* Facility Items - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Pintu Masuk Kantor Bersama</h2>
          </div>
          <img 
            src="/Profil/KantorDepan.jpeg" 
            alt="Pintu Masuk Kantor Bersama" 
            className="w-full h-64 md:h-80 object-cover"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Aula Lantai 1 dan Kantor PC Persis Banjaran</h2>
          </div>
          <img 
            src="/Profil/KantorLt1.jpeg" 
            alt="Aula Lantai 1 dan Kantor PC Persis Banjaran" 
            className="w-full h-64 md:h-80 object-cover"
          />
        </div>
      </div>

      {/* Facility Items - Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Aula Lantai 2 dan Kantor Otonom PC Persis Banjaran</h2>
          </div>
          <img 
            src="/Profil/KantorLt2.jpeg" 
            alt="Aula Lantai 2 dan Kantor Otonom PC Persis Banjaran" 
            className="w-full h-64 md:h-80 object-cover"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Kantin Sehat</h2>
          </div>
          <img 
            src="/Profil/Kantin.jpg" 
            alt="Kantin Sehat" 
            className="w-full h-64 md:h-80 object-cover"
          />
        </div>
      </div>

      {/* Facility Items - Third Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Kantor Lazpersis KLP Banjaran</h2>
          </div>
          <img 
            src="/Profil/KantorKLP.jpeg" 
            alt="Kantor Lazpersis KLP Banjaran" 
            className="w-full h-64 md:h-80 object-cover"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Mesjid PC Persis Banjaran</h2>
          </div>
          <img 
            src="/Profil/Mesjid.jpg" 
            alt="Mesjid PC Persis Banjaran" 
            className="w-full h-64 md:h-80 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Fasilitas;