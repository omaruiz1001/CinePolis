import { useState, useEffect, useCallback } from 'react'
import {
  getPopularMovies,
  searchMovies,
  getMoviesByGenre,
} from '../services/tmdb'

/**
 * useMovies: Gestiona el ciclo de vida de las películas (carga, búsqueda y paginación).
 * @param {string} searchQuery - Término de búsqueda.
 * @param {number|null} selectedGenre - ID del género para filtrar.
 */
const useMovies = (searchQuery = '', selectedGenre = null) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchMovies = useCallback(async (pageNum = 1) => {
    setLoading(true)
    setError(null)

    try {
      let data
      const query = searchQuery.trim()

      // Estrategia de fetching según parámetros activos
      if (query) {
        data = await searchMovies(query, pageNum)
      } else if (selectedGenre) {
        data = await getMoviesByGenre(selectedGenre, pageNum)
      } else {
        data = await getPopularMovies(pageNum)
      }

      setTotalPages(data.total_pages)
      setPage(pageNum)
      
      // Actualización inteligente de la lista
      setMovies(prev => pageNum === 1 ? data.results : [...prev, ...data.results])

    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedGenre])

  // Reset y carga inicial ante cambios en filtros o búsqueda
  useEffect(() => {
    fetchMovies(1)
  }, [fetchMovies])

  const loadMore = () => {
    if (!loading && page < totalPages) {
      fetchMovies(page + 1)
    }
  }

  return {
    movies,
    loading,
    error,
    loadMore,
    hasMore: page < totalPages,
  }
}

export default useMovies