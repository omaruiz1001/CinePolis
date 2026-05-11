import { useState, useEffect } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { getGenres } from "../services/tmdb";
import useDebounce from "../hooks/useDebounce";

/**
 * Navbar: Control central de filtros y navegación.
 * Implementa búsqueda con retardo (debounce) para optimizar llamadas a la API.
 */
const Navbar = ({ onSearch, onGenreChange, currentPage, onPageChange }) => {
  const { favoritesCount } = useFavorites();

  const [inputValue, setInputValue] = useState("");
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Debounce de 500ms para evitar peticiones excesivas mientras el usuario escribe
  const debouncedQuery = useDebounce(inputValue, 500);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await getGenres();
        setGenres(data.genres);
      } catch (err) {
        console.error("Genre Load Error:", err);
      }
    };
    loadGenres();
  }, []);

  const handleGenreClick = (genreId) => {
    const newGenre = activeGenre === genreId ? null : genreId;
    setActiveGenre(newGenre);
    onGenreChange(newGenre);
    setInputValue(""); // Reset de búsqueda al filtrar por género
  };

  const handlePageChange = (page) => {
    onPageChange(page);
    setMenuOpen(false);
    // Reset global de filtros al navegar
    setInputValue("");
    setActiveGenre(null);
    onGenreChange(null);
    onSearch("");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Branding */}
        <button onClick={() => handlePageChange("home")} className="flex items-center gap-1 shrink-0">
          <span className="text-red-500 text-2xl font-black tracking-tighter">CINE</span>
          <span className="text-white text-2xl font-black tracking-tighter">AI</span>
        </button>

        {/* Desktop Search */}
        <div className="hidden sm:flex flex-1 max-w-md relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Buscar películas..."
            className="w-full bg-zinc-900 text-sm text-white rounded-full px-5 py-2 border border-zinc-800 focus:outline-none focus:border-red-500 transition-all"
          />
          {inputValue && (
            <button onClick={() => setInputValue("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
              ✕
            </button>
          )}
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange("home")}
            className={`hidden sm:block px-3 py-1.5 rounded text-sm font-medium ${currentPage === "home" ? "text-white bg-zinc-800" : "text-zinc-400 hover:text-white"}`}
          >
            Inicio
          </button>

          <button
            onClick={() => handlePageChange("favorites")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium ${currentPage === "favorites" ? "text-white bg-zinc-800" : "text-zinc-400 hover:text-white"}`}
          >
            <span>❤️</span>
            <span className="hidden sm:inline">Favoritos</span>
            {favoritesCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>

          <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden text-zinc-400 p-1">
            {menuOpen ? "✕" : "☰"}
          </button>
        </nav>
      </div>

      {/* Mobile Search Bar */}
      <div className="sm:hidden px-4 pb-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Buscar películas..."
          className="w-full bg-zinc-900 text-sm text-white rounded-full px-5 py-2 border border-zinc-800"
        />
      </div>

      {/* Genres Ribbon - Only on Home */}
      {currentPage === "home" && (
        <div className="border-t border-zinc-800 bg-zinc-950/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 py-2.5">
              <GenreButton 
                label="Todos" 
                active={activeGenre === null} 
                onClick={() => handleGenreClick(null)} 
              />
              {genres.map((g) => (
                <GenreButton 
                  key={g.id} 
                  label={g.name} 
                  active={activeGenre === g.id} 
                  onClick={() => handleGenreClick(g.id)} 
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-zinc-900 border-t border-zinc-800 px-4 py-3 flex flex-col gap-1 animate-in fade-in zoom-in-95">
          <button onClick={() => handlePageChange("home")} className="text-left text-zinc-300 py-2.5 text-sm">🎬 Inicio</button>
          <button onClick={() => handlePageChange("favorites")} className="text-left text-zinc-300 py-2.5 text-sm">❤️ Mis Favoritos</button>
        </div>
      )}
    </header>
  );
};

// Sub-componente interno para limpiar el JSX principal
const GenreButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all
      ${active ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800"}`}
  >
    {label}
  </button>
);

export default Navbar;