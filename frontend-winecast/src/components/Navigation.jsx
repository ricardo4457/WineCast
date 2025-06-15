import { useState } from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  // Estado para controlar se o menu mobile está aberto ou fechado
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    // Nav fixo no topo, com sombra e largura total
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="w-full px-6 py-3 flex items-center justify-between h-16">
        {/* Logo clicável que redireciona para a homepage */}
        <NavLink to="/" className="flex items-center">
          <img
            src="/assets/logo_WineCast.svg"
            alt="WineCast logo"
            className="h-28 w-auto"
            onError={(e) => {
              console.log("Logo failed to load");
              e.target.style.display = "none";
            }}
          />
        </NavLink>

        {/* Container para menu e botão toggle no mobile */}
        <div className="flex items-center">
          {/* Botão hamburguer / close que aparece só no sm (small) e menores */}
          <button
            className="sm:hidden text-[#8B5E3C] mr-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
          {/* Lista de links do menu */}

          <ul
            className={`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8
           absolute sm:static bg-white w-full sm:w-auto left-0 sm:left-auto top-full sm:top-auto
          transition-transform duration-200 ease-in-out pl-0
          ${menuOpen ? "block" : "hidden sm:flex"}
        `}
          >
            <li>
              <NavLink
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "text-[#8B5E3C] border-b-2 border-[#8B5E3C] pb-1 block py-2 px-4"
                    : "block py-2 px-4 text-[#543826] hover:text-[#6F4B30] transition"
                }
              >
                Contactos
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
