// ═══════════════════════════════════════════════════
// pages/Favorites.jsx
// Página de favoritos del usuario.
// Lee directamente del contexto — no necesita
// llamadas a la API porque los datos ya están
// en memoria (y en localStorage).
// ═══════════════════════════════════════════════════

import { useFavorites } from '../context/FavoritesContext'
import MovieCard from '../components/MovieCard'

// ─────────────────────────────────────────
// Props:
//   onSelectMovie — función para abrir el modal
// ─────────────────────────────────────────
const Favorites = ({ onSelectMovie }) => {

  const { favorites, removeFavorite } = useFavorites()

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">

      {/* ── Header con título y contador ── */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-semibold">
          Mis favoritos
        </h2>
        {favorites.length > 0 && (
          <span className="text-zinc-500 text-sm">
            {favorites.length} película{favorites.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Lista vacía ── */}
      {favorites.length === 0 && (
        <div className="flex flex-col items-center justify-center
                        py-32 text-center">
          <p className="text-5xl mb-4">🎬</p>
          <p className="text-zinc-300 text-lg font-medium mb-2">
            Tu lista está vacía
          </p>
          <p className="text-zinc-600 text-sm max-w-xs">
            Explora las películas y presiona el corazón para
            guardarlas aquí
          </p>
        </div>
      )}

      {/* ── Grid de favoritos ── */}
      {favorites.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
                        lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {favorites.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={onSelectMovie}
            />
          ))}
        </div>
      )}

    </main>
  )
}

export default Favorites