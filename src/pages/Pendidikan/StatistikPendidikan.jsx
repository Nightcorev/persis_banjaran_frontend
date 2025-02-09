import React from "react";

function StatistikPendidikan() {
  const stats = [
    {
      title: "Santri",
      count: 1200,
      color: "bg-blue-500",
      route: "/users/data-anggota",
    },
    { title: "Asatidz", count: 850, color: "bg-green-500", route: "" },
    { title: "Total Pesantren", count: 350, color: "bg-red-500", route: "" },
  ];

  const statalts = [
    {
      title: "RA",
      count: 1200,
      color: "bg-yellow-600",
      route: "",
    },
    { title: "MD", count: 850, color: "bg-blue-800", route: "" },
    { title: "MI", count: 350, color: "bg-red-600", route: "" },
    {
      title: "MTs",
      count: 1200,
      color: "bg-green-800",
      route: "",
    },
    { title: "SMP IT", count: 850, color: "bg-amber-600", route: "" },
    { title: "Mu'alimin", count: 350, color: " bg-lime-800", route: "" },
  ];

  return (
    <div className="space-y-8   p-4">
      {/* Baris Pertama - 3 Elemen */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`flex items-center p-4 text-white rounded-lg shadow-lg ${stat.color}`}
          >
            <div className="ml-4 flex-1 text-center">
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              <p className="text-4xl font-bold">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Baris Kedua - 6 Elemen */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {statalts.map((stat, index) => (
          <div
            key={index}
            className={`flex items-center p-4 text-white rounded-lg shadow-lg ${stat.color}`}
          >
            <div className="ml-4 flex-1 text-center">
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              <p className="text-4xl font-bold">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatistikPendidikan;
