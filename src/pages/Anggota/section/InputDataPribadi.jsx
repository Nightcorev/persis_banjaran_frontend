
const InputDataPribadi = ({nomorAnggota, setNomorAnggota}) => {
    return (
    <div>
        <div className="flex flex-col gap-2 pb-4">
          <label className="text-xs">Nomor Anggota</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded-md text-xs"
            value={nomorAnggota}
            onChange={(e) => setNomorAnggota(e.target.value)} 
          />
        </div>
        <div className="flex flex-col gap-2 pb-4">
              <label className="text-xs">Nama Lengkap</label>
              <input 
                  type="text" 
                  className="w-full p-2 border rounded-md text-xs" 
              />
          </div>
      
          <div className="flex flex-col gap-2 pb-4">
              <label className="text-xs">Tempat Lahir</label>
              <input 
                  type="text" 
                  className="w-full p-2 border rounded-md text-xs" 
              />
          </div>
      
          <div className="flex flex-col gap-2 pb-4">
              <label className="text-xs">Tanggal Lahir</label>
              <input 
                  type="date" 
                  className="w-full p-2 border rounded-md text-xs" 
              />
          </div>
      
          <div className="flex flex-col gap-2 pb-4">
              <label className="text-xs">Status Marital</label>
              <select 
                  className="w-full p-2 border rounded-md text-xs"
              >
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
              </select>
          </div>
      
          <div className="flex flex-col gap-2 pb-4">
              <label className="text-xs">Golongan Darah</label>
              <select 
                  className="w-full p-2 border rounded-md text-xs"
              >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
              </select>
          </div>
      
          <div className="flex flex-col gap-2 pb-4">
              <label className="text-xs">Email</label>
              <input 
                  type="email" 
                  className="w-full p-2 border rounded-md text-xs" 
              />
          </div>
      
          <div className="flex flex-col gap-2 pb-4">
              <label className="text-xs">Nomor Telepon</label>
              <input 
                  type="tel" 
                  className="w-full p-2 border rounded-md text-xs" 
              />
          </div>
      
          <div className="flex flex-col gap-2 pb-4">
              <label className="text-xs">Alamat</label>
              <input 
                  type="text" 
                  className="w-full p-2 border rounded-md text-xs" 
              />
          </div>
      
          <div className="flex flex-col gap-2 pb-4">
              <label className="text-xs">Otonom</label>
              <select 
                  className="w-full p-2 border rounded-md text-xs"
              >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
              </select>
          </div>
      
          <div className="flex flex-col gap-2 pb-4">
              <label className="text-xs">Jamaah</label>
              <select 
                  className="w-full p-2 border rounded-md text-xs"
              >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
              </select>
          </div>
      
          <div className="flex flex-col gap-2 pb-4">
              <label className="text-xs">Status Aktif</label>
              <select 
                  className="w-full p-2 border rounded-md text-xs"
              >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
              </select>
          </div>
      
          <div className="flex flex-col gap-2 pb-4">
              <label className="text-xs">Keterangan</label>
              <textarea 
                  className="w-full p-2 border rounded-md text-xs" 
              />
          </div>
      
          <div className="flex flex-col gap-2 pb-4">
              <label className="text-xs">Masa Aktif Anggota</label>
              <input 
                  type="date" 
                  className="w-full p-2 border rounded-md text-xs" 
              />
          </div>
    </div>    
    );
};

export default InputDataPribadi;