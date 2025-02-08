import React from 'react';

const Tasykil = () => {
    return (
    <>

{/* Video Perkenalan */}
<div className="p-6 bg-white rounded-lg shadow-lg" style={{ marginTop: "40px", marginLeft: "110px", marginRight: "70px" }}>
        <h1 className="text-lg font-bold mb-4">Video Perkenalan Tasykil PC Persis Banjaran</h1>
        <div className="aspect-w-16 aspect-h-9">
            <iframe
            width="100%"
            height="500px"
            src="https://www.youtube.com/embed/6Q1FGpWjN5I"
            title="Video Perkenalan Tasykil PC Persis Banjaran"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            ></iframe>
        </div>
        </div>

        <div className="flex" style={{ height: "500px", marginTop: "30px", gap: "40px" }}>
        <div className="p-6 bg-white rounded-lg shadow-lg w-1/2" style={{ marginLeft: "110px" }}>
            <h1 className="text-lg font-bold mb-4">Tasykil PC Persistri Banjaran</h1>
            <img 
            src="/Profil/Profil_Pesistri.jpeg" 
            alt="Profil Persistri" 
            style={{ height: "400px", width: "100%", objectFit: "cover", borderRadius: "8px" }} 
            />
        </div>

        <div className="p-6 bg-white rounded-lg shadow-lg w-1/2" style={{ marginRight: "70px" }}>
            <h1 className="text-lg font-bold mb-4">Tasykil PC Pemuda Persis Banjaran</h1>
            <img 
            src="/Profil/Profil_Pemuda.jpg" 
            alt="Profil Pemuda" 
            style={{ height: "400px", width: "100%", objectFit: "cover", borderRadius: "8px" }} 
            />
        </div>
        </div>

        <div className="flex" style={{ height: "500px", marginTop: "30px", gap: "40px" }}>
        <div className="p-6 bg-white rounded-lg shadow-lg w-1/2" style={{ marginLeft: "110px" }}>
            <h1 className="text-lg font-bold mb-4">Lazpersis KLP Banjaran</h1>
            <img 
            src="/Profil/Profil_LazpersisKLP .jpeg" 
            alt="Lazpersis KLP" 
            style={{ height: "400px", width: "100%", objectFit: "cover", borderRadius: "8px" }} 
            />
        </div>

        <div className="p-6 bg-white rounded-lg shadow-lg w-1/2" style={{ marginRight: "70px" }}>
            <h1 className="text-lg font-bold mb-4">Tasykil PC Pemudi Persis Banjaran</h1>
            <img 
            src="/Profil/Profil_Pemudi.jpeg" 
            alt="Profil Pemudi" 
            style={{ height: "400px", width: "100%", objectFit: "cover", borderRadius: "8px" }} 
            />
        </div>
        </div>
      
    </>
    );
  };
  
export default Tasykil;  