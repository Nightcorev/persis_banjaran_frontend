import React from "react";

const PesantrenTab = () => {
  const pesantrens = [
    {
      id_pesantren: 1,
      nama_pesantren: "PPI 31 Banjaran",
      tingkat: "Madrasah Diniyyah",
      nama_mudir: "Ahmad Aminudin,S.Pd",
      jum_asatidz: 53,
      jum_santri: 43,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Data Pesantren</h2>
      <div className="overflow-x-auto max-h-[65vh] border rounded-lg text-sm">
        <table className="table-auto w-full border-collapse border border-gray-300 text-black">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Nama Pesantren</th>
              <th className="border p-2">Tingkat</th>
              <th className="border p-2">Mudir</th>
              <th className="border p-2">Jumlah Asatidz</th>
              <th className="border p-2">Jumlah Santri</th>
            </tr>
          </thead>
          <tbody>
            {pesantrens.map((pesantren) => (
              <tr key={pesantren.id_pesantren}>
                <td className="border p-2">{pesantren.nama_pesantren}</td>
                <td className="border p-2">{pesantren.tingkat}</td>
                <td className="border p-2">{pesantren.nama_mudir}</td>
                <td className="border p-2">{pesantren.jum_asatidz}</td>
                <td className="border p-2">{pesantren.jum_santri}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PesantrenTab;
