import React from 'react';

const Dashboard = () => {
    return (
    <>
      <div className="flex flex-col md:flex-row mx-4 md:mx-0 gap-6 md:gap-10 mt-6 md:mt-10">
        <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg w-full md:w-1/3 md:ml-[110px]">
          <h1 className="text-lg font-bold mb-4">Jumlah Iuran</h1>
        </div>

        <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg w-full md:w-1/3">
          <h1 className="text-lg font-bold mb-4"></h1>
          
        </div>

        <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg w-full md:w-1/3 md:mr-[70px]">
          <h1 className="text-lg font-bold mb-4">&nbsp;</h1>
        </div>
      </div>

      {/* sementara aja */}
      <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg mx-4 md:mx-0 mt-6 md:mt-8 md:ml-[110px] md:mr-[70px]">
        <h1 className="text-lg font-bold mb-4">Peta Geografis</h1>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d253452.78962700645!2d107.5959778!3d-6.9857253!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68eb9ba266a055%3A0x8fa03876e318d5dd!2sPesantren%20Persis%2031%20Banjaran!5e0!3m2!1sid!2sid!4v1739006149205!5m2!1sid!2sid"
          width="100%"
          height="350px"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
      
    </>
    );
  };
  
export default Dashboard;