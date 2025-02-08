import React from 'react';

function Statistik() {
  const stats = [
    { title: "Total Members", count: 1200, color: "bg-blue-500", route: "/users/data-anggota" },
    { title: "Active Members", count: 850, color: "bg-green-500", route: "" },
    { title: "Inactive Members", count: 350, color: "bg-red-500" , route: ""},
  ];
  
  return (
    <div className="flex gap-4 p-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`flex items-center p-4 w-1/3 text-white rounded-lg shadow-lg ${stat.color}`}
        >
          <div className="p-3 bg-white rounded-full text-gray-700">
            <span className="text-2xl">👤</span>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold">{stat.title}</h3>
            <p className="text-2xl font-bold">{stat.count}</p>
          </div>
          <a href={stat.route}><button className="ml-auto px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 text-xs">
            Selengkapnya
          </button></a>
        </div>
      ))}
    </div>
  );
}

export default Statistik;
