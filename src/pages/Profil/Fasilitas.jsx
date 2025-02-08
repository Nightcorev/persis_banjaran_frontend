import React from 'react';

const Fasilitas = () => {
    return (
    <>

{/* Video Perkenalan */}

        <div className="flex" style={{ height: "500px", marginTop: "40px", gap: "40px" }}>
        <div className="p-6 bg-white rounded-lg shadow-lg w-1/2" style={{ marginLeft: "110px" }}>
            <h1 className="text-lg font-bold mb-4">Pintu Masuk Kantor Bersama</h1>
            <img 
            src="/Profil/KantorDepan.jpeg" 
            alt="Pintu Masuk Kantor Bersama" 
            style={{ height: "400px", width: "100%", objectFit: "cover", borderRadius: "8px" }} 
            />
        </div>

        <div className="p-6 bg-white rounded-lg shadow-lg w-1/2" style={{ marginRight: "70px" }}>
            <h1 className="text-lg font-bold mb-4">Aula Lantai 1 dan Kantor PC Persis Banjaran</h1>
            <img 
            src="/Profil/KantorLt1.jpeg" 
            alt="Aula Lantai 1 dan Kantor PC Persis Banjaran" 
            style={{ height: "400px", width: "100%", objectFit: "cover", borderRadius: "8px" }} 
            />
        </div>
        </div>

        <div className="flex" style={{ height: "500px", marginTop: "30px", gap: "40px" }}>
        <div className="p-6 bg-white rounded-lg shadow-lg w-1/2" style={{ marginLeft: "110px" }}>
            <h1 className="text-lg font-bold mb-4">Aula Lantai 2 dan Kantor Otonom PC Persis Banjaran</h1>
            <img 
            src="/Profil/KantorLt2.jpeg" 
            alt="Aula Lantai 2 dan Kantor Otonom PC Persis Banjaran" 
            style={{ height: "400px", width: "100%", objectFit: "cover", borderRadius: "8px" }} 
            />
        </div>

        <div className="p-6 bg-white rounded-lg shadow-lg w-1/2" style={{ marginRight: "70px" }}>
            <h1 className="text-lg font-bold mb-4">Kantin Sehat</h1>
            <img 
            src="/Profil/Kantin.jpg" 
            alt="Kantin Sehat" 
            style={{ height: "400px", width: "100%", objectFit: "cover", borderRadius: "8px" }} 
            />
        </div>
        </div>

        <div className="flex" style={{ height: "500px", marginTop: "30px", gap: "40px" }}>
        <div className="p-6 bg-white rounded-lg shadow-lg w-1/2" style={{ marginLeft: "110px" }}>
            <h1 className="text-lg font-bold mb-4">Kantor Lazpersis KLP Banjaran</h1>
            <img 
            src="/Profil/KantorKLP.jpeg" 
            alt="Kantor Lazpersis KLP Banjaran" 
            style={{ height: "400px", width: "100%", objectFit: "cover", borderRadius: "8px" }} 
            />
        </div>

        <div className="p-6 bg-white rounded-lg shadow-lg w-1/2" style={{ marginRight: "70px" }}>
            <h1 className="text-lg font-bold mb-4">Mesjid PC Persis Banjaran</h1>
            <img 
            src="/Profil/Mesjid.jpg" 
            alt="Mesjid PC Persis Banjaran" 
            style={{ height: "400px", width: "100%", objectFit: "cover", borderRadius: "8px" }} 
            />
        </div>
        </div>
      
    </>
    );
  };
  
export default Fasilitas;  