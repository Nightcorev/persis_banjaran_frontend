import React from 'react';

const Dashboard = () => {
    return (
    <>
      <div className="flex" style={{ height: "230px", marginTop: "40px", gap: "40px" }}>
        <div className="p-6 bg-white rounded-lg shadow-lg w-1/3" style={{ marginLeft: "110px" }}>
          <h1 className="text-lg font-bold mb-4">Jumlah Iuran</h1>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-lg w-1/3">
          <h1 className="text-lg font-bold mb-4">Jadwal Dakwah</h1>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-lg w-1/3" style={{ marginRight: "70px" }}>
          <h1 className="text-lg font-bold mb-4">&nbsp;</h1>
        </div>
      </div>

      {/* sementara aja */}
      <div className="p-6 bg-white rounded-lg shadow-lg" style={{ marginTop: "30px", marginLeft: "110px", marginRight: "70px" }}>
        <h1 className="text-lg font-bold mb-4">Peta Geografis</h1>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d253452.78962700645!2d107.5959778!3d-6.9857253!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68eb9ba266a055%3A0x8fa03876e318d5dd!2sPesantren%20Persis%2031%20Banjaran!5e0!3m2!1sid!2sid!4v1739006149205!5m2!1sid!2sid"
          width="100%"
          height="500px"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
      
    </>
    );
  };
  
export default Dashboard;  