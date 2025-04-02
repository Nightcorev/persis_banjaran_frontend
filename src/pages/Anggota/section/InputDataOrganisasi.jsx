
const InputDataOrganisasi = ({ data, onDataChange, nomorAnggota }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onDataChange({ ...data, [name]: value });
    };
    
  return (
    <div className="flex justify-center">
        <div className="w-full max-w-[60%] px-4 sm:px-2">
            <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Nomor Anggota</label>
            <input
            type="text"
            className="w-full p-2 border rounded-md text-xs"
            value={nomorAnggota}
            disabled
            />
        </div>

        <div className="flex items-center gap-4 pb-4">
                <label className="text-xs w-1/3">Keterlibatan Organisasi</label>
                <select
                name="keterlibatanOrganisasi"
                className="w-full p-2 border rounded-md text-xs"
                value={data.keterlibatanOrganisasi}
                onChange={handleInputChange}
                >
                <option value="">-- Silahkan Pilih</option>
                <option value="Tidak Ada">Tidak Ada</option>
                <option value="Organisasi Profesi">Organisasi Profesi</option>
                <option value="Lembaga Pemerintahan">Lembaga Pemerintahan</option>
                <option value="Forum/Aliansi/Komite atau yang semisalnya">Forum/Aliansi/Komite atau yang semisalnya</option>
                <option value="Partai Politik">Partai Politik</option>
                </select>
            </div>

        <div className="flex items-center gap-4 pb-4 pb-4">
            <label className="text-xs w-1/3">Nama Organisasi</label>
            <input
            type="text"
            name="namaOrganisasi"
            className="w-full p-2 border rounded-md text-xs"
            value={data.namaOrganisasi || ""}
            onChange={handleInputChange}
            />
        </div>

        </div>
    </div>
  );
};

export default InputDataOrganisasi;
