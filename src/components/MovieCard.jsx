import { useState } from 'react'
import { useFavorites } from '../context/FavoritesContext'
import { getPosterUrl } from '../services/tmdb'

/**
 * MovieCard: Renderiza el poster y metadatos básicos.
 * Maneja fallback de imágenes y estado de favoritos.
 */
const MovieCard = ({ movie, onSelect }) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [imgError, setImgError] = useState(false)

  const posterUrl = getPosterUrl(movie.poster_path)
  const isFav = isFavorite(movie.id)
  const year = movie.release_date?.slice(0, 4) ?? 'N/A'

  // Lógica de color para el badge de rating
  const getRatingColor = (rating) => {
    if (rating >= 7) return 'text-green-400'
    if (rating >= 5) return 'text-yellow-400'
    return 'text-red-400'
  }

  const handleFavoriteClick = (e) => {
    e.stopPropagation() // Evita abrir el modal al clickear el corazón
    toggleFavorite(movie)
  }

  return (
    <article
      onClick={() => onSelect(movie)}
      className="relative group cursor-pointer rounded-lg overflow-hidden
                 bg-zinc-900 border border-zinc-800 transition-all 
                 hover:-translate-y-1 hover:border-zinc-600 hover:shadow-xl hover:shadow-black/50"
    >
      {/* Media Container */}
      <div className="relative aspect-2/3 bg-zinc-800">
        {posterUrl && !imgError ? (
          <img
            src={posterUrl}
            alt={movie.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-600">
            <span className="text-4xl">🎬</span>
            <span className="text-xs text-center px-2">{movie.title}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />

        {/* Favorite Trigger */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center 
                     transition-all duration-200 backdrop-blur-sm
                      ${isFav 
                        ? 'bg-red-500 text-white scale-110' 
                        : 'bg-black/50 text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-white'}`}
        >
          {isFav ? '❤️' : '🤍'}
        </button>

        {/* Score Badge */}
        {movie.vote_average > 0 && (
          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5 flex items-center gap-1">
            <span className="text-yellow-400 text-xs">★</span>
            <span className={`text-xs font-bold ${getRatingColor(movie.vote_average)}`}>
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="p-3">
        <h3 className="text-white text-sm font-medium leading-tight line-clamp-2 mb-1">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-zinc-500 text-xs">{year}</span>
          {movie.vote_count > 0 && (
            <span className="text-zinc-600 text-xs">
              {movie.vote_count.toLocaleString()} votos
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

export default MovieCard