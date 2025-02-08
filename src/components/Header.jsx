const Header = () => {
  return (
    <header 
      className="bg-emerald-800 flex items-center justify-between p-4"
      style={{ height: "60px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
    >

      <a 
        href="https://profil.persisbanjaran.org/" 
        className="flex items-center text-white text-lg font-bold"
        style={{ textDecoration: "none" }}
      >
        <img 
          src="https://profil.persisbanjaran.org/media/images/logo.png" 
          alt="Logo Persis Banjaran" 
          style={{ height: "40px", marginRight: "10px" }} 
        />
        Persis Banjaran
      </a>

      <nav>
        <ul className="flex space-x-4">
          <li>
            <a href="#" className="text-white hover:underline">Link 1</a>
          </li>
          <li>
            <a href="#" className="text-white hover:underline">Link 2</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
