import { useState } from "react";

function CollapsibleMenu({ title = "Menu", children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-black bg-gray-200 mb-3">
      <div
        className="flex justify-between items-center p-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span className="text-sm">{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && <div className="p-3 space-y-2">{children}</div>}
    </div>
  );
}

export default function KelolaChatbot() {
  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-xl font-semibold mb-4">KELOLA CHATBOT</h1>
      <div className="border border-black bg-gray-200 p-4">
        <div className="flex justify-end mb-4">
          <button className="border border-black px-3 py-1 bg-gray-300 hover:bg-gray-400">
            Add Menu
          </button>
        </div>

        <CollapsibleMenu title="Informasi Iuran">
          <input
            type="text"
            placeholder="Input 1"
            className="w-full border border-black px-3 py-1 bg-gray-300"
          />
          <input
            type="text"
            placeholder="Input 2"
            className="w-full border border-black px-3 py-1 bg-gray-300"
          />
          <input
            type="text"
            placeholder="Input 3"
            className="w-full border border-black px-3 py-1 bg-gray-300"
          />
        </CollapsibleMenu>

        <CollapsibleMenu title="Menu 2" />
        <CollapsibleMenu title="Menu 3" />
      </div>
    </div>
  );
}
