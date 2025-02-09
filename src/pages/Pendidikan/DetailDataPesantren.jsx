import React from "react";
import { Link } from "react-router-dom";

const DetailDataPesantren = () => {
  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link
          to="/pendidikan/data-pesantren"
          className="text-4xl p-2 hover:bg-gray-200 rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </Link>
        <h1 className="text-4xl font-bold ml-4">Detail Data Pesantren</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-wrap gap-6 p-4">
        {/* Profile Card */}
        <div className="bg-white shadow-md rounded-3xl p-4 text-center ">
          <div className="w-64 h-80 bg-gray-300 flex items-center justify-center rounded-md mx-auto">
            <span className="text-gray-500">Foto</span>
          </div>
          <p className="font-bold text-lg mt-4">Abdul Mutakir</p>
          <p className="text-gray-600 ">Mudir</p>
        </div>

        {/* Statistics & Details */}
        <div className="flex-1 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-6 bg-white rounded-3xl shadow-lg flex items-center">
              <h3 className="text-6xl font-semibold mr-4">103</h3>
              <p className="text-2xl font-bold">Santri</p>
            </div>
            <div className="p-6 bg-white rounded-3xl shadow-lg flex items-center">
              <h3 className="text-6xl font-semibold mr-4">10</h3>
              <p className="text-2xl font-bold">Asatidz</p>
            </div>
          </div>

          {/* Detail Information */}
          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1 my-2">
                <p className="font-bold">Nama Pesantren</p>
                <p>PPI 351 Girangdeukeut</p>
              </div>
              <div className="col-span-3 my-2">
                <p className="font-bold">Alamat</p>
                <p>Jl. Ciapus No.53 Ds. Banjaran Kec. Banjaran Kab. Bandung</p>
              </div>
              <div>
                <p className="font-bold my-2">Tingkat</p>
                <p>Madrasah Diniyyah</p>
              </div>
              <div>
                <p className="font-bold my-2">Nomor Kontak</p>
                <p>088218486116</p>
              </div>
              <div>
                <p className="font-bold my-2">Luas Tanah</p>
                <p>200 m²</p>
              </div>
              <div>
                <p className="font-bold my-2">Status Tanah</p>
                <p>Legal</p>
              </div>
              <div>
                <p className="font-bold my-2">Nomor Pesantren</p>
                <p>351</p>
              </div>
              <div>
                <p className="font-bold my-2">Tahun Berdiri</p>
                <p>2003</p>
              </div>
              <div className="col-span-2 my-2">
                <p className="font-bold">Luas Bangunan</p>
                <p>100 m²</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailDataPesantren;
