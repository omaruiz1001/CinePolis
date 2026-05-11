// ═══════════════════════════════════════════════════
// pages/Home.jsx
// Página principal de la app. Muestra el grid de
// películas y maneja los estados de carga y error.
// Recibe searchQuery y selectedGenre desde App.jsx
// y los pasa a useMovies para controlar qué mostrar.
// ═══════════════════════════════════════════════════

import { useCallback } from 'react'
import useMovies from '../hooks/useMovies'
import MovieCard from '../components/MovieCard'

// ─────────────────────────────────────────
// Props:
//   searchQuery    — texto de búsqueda (viene de Navbar via App)
//   selectedGenre  — id del género seleccionado o null
//   onSelectMovie  — función para abrir el modal con una película
// ─────────────────────────────────────────
const Home = ({ searchQuery, selectedGenre, onSelectMovie }) => {

  // useMovies decide qué endpoint llamar según
  // searchQuery y selectedGenre automáticamente
  const { movies, loading, error, loadMore, hasMore } = useMovies(
    searchQuery,
    selectedGenre
  )

  // ─────────────────────────────────────────
  // Título dinámico según el estado actual
  // Le dice al usuario qué está viendo
  // ─────────────────────────────────────────
  const getTitle = () => {
    if (searchQuery) return `Resultados para "${searchQuery}"`
    if (selectedGenre) return 'Películas por género'
    return 'Películas populares'
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">

      {/* ── Título de sección ── */}
      <h2 className="text-white text-xl font-semibold mb-6">
        {getTitle()}
      </h2>

      {/* ── Estado de error ── */}
      {error && (
        <div className="flex flex-col items-center justify-center
                        py-20 text-center">
          <p className="text-4xl mb-4">😕</p>
          <p className="text-zinc-400 text-lg mb-2">
            Algo salió mal
          </p>
          <p className="text-zinc-600 text-sm">{error}</p>
        </div>
      )}

      {/* ── Sin resultados ── */}
      {!loading && !error && movies.length === 0 && (
        <div className="flex flex-col items-center justify-center
                        py-20 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-zinc-400 text-lg mb-2">
            No encontramos resultados
          </p>
          <p className="text-zinc-600 text-sm">
            Intenta con otro término de búsqueda
          </p>
        </div>
      )}

      {/* ── Grid de películas ── */}
      {movies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
                        lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={onSelectMovie}
            />
          ))}

          {/* ── Skeleton cards durante carga de más películas ── */}
          {loading && (
            <>
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="rounded-lg overflow-hidden bg-zinc-900
                             border border-zinc-800 animate-pulse"
                >
                  <div className="aspect-2/3 bg-zinc-800" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-zinc-800 rounded w-3/4" />
                    <div className="h-3 bg-zinc-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── Skeleton inicial (primera carga, sin películas aún) ── */}
      {loading && movies.length === 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
                        lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={`initial-skeleton-${i}`}
              className="rounded-lg overflow-hidden bg-zinc-900
                         border border-zinc-800 animate-pulse"
            >
              <div className="aspect-2/3 bg-zinc-800" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Botón Ver más ── */}
      {hasMore && !loading && movies.length > 0 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={loadMore}
            className="px-8 py-3 bg-zinc-800 text-zinc-300 rounded-full
                       text-sm font-medium border border-zinc-700
                       hover:bg-zinc-700 hover:text-white hover:border-zinc-500
                       transition-all duration-200"
          >
            Ver más películas
          </button>
        </div>
      )}

    </main>
  )
}

export default Home