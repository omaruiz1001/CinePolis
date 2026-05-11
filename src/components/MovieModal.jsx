import { useEffect, useState } from 'react'
import { useFavorites } from '../context/FavoritesContext'
import {
  getMovieDetail,
  getMovieCredits,
  getMovieVideos,
  getPosterUrl,
  getBackdropUrl,
} from '../services/tmdb'

/**
 * MovieModal: Vista detallada de la película.
 * Gestiona fetch paralelo de créditos y trailers, bloqueo de scroll 
 * y accesibilidad mediante teclas de escape.
 */
const MovieModal = ({ movie, onClose }) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  
  const [detail, setDetail] = useState(null)
  const [credits, setCredits] = useState(null)
  const [trailer, setTrailer] = useState(null)
  const [loading, setLoading] = useState(true)

  const isFav = isFavorite(movie.id)

  useEffect(() => {
    const fetchFullData = async () => {
      setLoading(true)
      try {
        // Ejecución en paralelo para optimizar performance
        const [detailData, creditsData, videosData] = await Promise.all([
          getMovieDetail(movie.id),
          getMovieCredits(movie.id),
          getMovieVideos(movie.id),
        ])

        setDetail(detailData)
        setCredits(creditsData)

        // Priorizamos el trailer oficial de YT
        const official = videosData.results.find(
          v => v.type === 'Trailer' && v.site === 'YouTube'
        ) ?? videosData.results[0]

        setTrailer(official)
      } catch (err) {
        console.error('Modal Fetch Error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchFullData()
  }, [movie.id])

  // Prevención de scroll en el body al montar
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'unset' }
  }, [])

  // Soporte para cierre mediante tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const formatRuntime = (mins) => {
    if (!mins) return 'N/A'
    return `${Math.floor(mins / 60)}h ${mins % 60}min`
  }

  const year = movie.release_date?.slice(0, 4) ?? 'N/A'
  const backdrop = getBackdropUrl(movie.backdrop_path)
  const poster = getPosterUrl(movie.poster_path)

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-800 animate-in fade-in slide-in-from-bottom-4"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
        >
          ✕
        </button>

        {/* Hero Section */}
        <div className="relative h-56 sm:h-72 bg-zinc-800">
          {backdrop && <img src={backdrop} alt="" className="w-full h-full object-cover opacity-60" />}
          <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
        </div>

        <div className="px-6 pb-8">
          <div className="flex gap-5 -mt-16 relative mb-6">
            <div className="shrink-0 w-24 sm:w-32 rounded-lg overflow-hidden border-2 border-zinc-700 shadow-xl bg-zinc-800">
              {poster ? <img src={poster} alt={movie.title} className="w-full h-full object-cover" /> : <div className="aspect-2/3 flex items-center justify-center text-2xl">🎬</div>}
            </div>

            <div className="pt-16 sm:pt-20 flex-1 min-w-0">
              <h2 className="text-white text-xl sm:text-2xl font-bold leading-tight line-clamp-2">
                {movie.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400 my-2">
                <span>{year}</span>
                {detail && (
                  <>
                    <span>·</span>
                    <span>{formatRuntime(detail.runtime)}</span>
                    {detail.vote_average > 0 && <span className="text-yellow-400">★ {detail.vote_average.toFixed(1)}</span>}
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {detail?.genres.map(g => (
                  <span key={g.id} className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-xs border border-zinc-700">
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 animate-pulse py-4">
              <div className="h-4 bg-zinc-800 rounded w-3/4" />
              <div className="h-4 bg-zinc-800 rounded w-full" />
            </div>
          ) : (
            <>
              {/* Actions */}
              <button
                onClick={() => toggleFavorite(movie)}
                className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all mb-6 flex items-center justify-center gap-2
                  ${isFav ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-zinc-800 text-zinc-300 border border-zinc-700'}`}
              >
                {isFav ? '❤️ En tu lista' : '🤍 Agregar a favoritos'}
              </button>

              {/* Info Sections */}
              {detail?.overview && (
                <section className="mb-6">
                  <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">Sinopsis</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed">{detail.overview}</p>
                </section>
              )}

              {trailer && (
                <section className="mb-6">
                  <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3">Trailer</h3>
                  <div className="aspect-video rounded-lg overflow-hidden bg-zinc-800">
                    <iframe
                      src={`https://www.youtube.com/embed/${trailer.key}?rel=0`}
                      title={trailer.name}
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>
                </section>
              )}

              {/* Cast Grid */}
              {credits?.cast?.length > 0 && (
                <section>
                  <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3">Reparto</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {credits.cast.slice(0, 8).map(actor => (
                      <div key={actor.id} className="text-center">
                        <div className="w-14 h-14 rounded-full mx-auto mb-2 bg-zinc-800 overflow-hidden border border-zinc-700">
                          {actor.profile_path ? (
                            <img src={getPosterUrl(actor.profile_path, 'w185')} alt={actor.name} className="w-full h-full object-cover" />
                          ) : <div className="w-full h-full flex items-center justify-center text-xl">👤</div>}
                        </div>
                        <p className="text-white text-[10px] font-medium line-clamp-1">{actor.name}</p>
                        <p className="text-zinc-500 text-[10px] line-clamp-1">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieModal