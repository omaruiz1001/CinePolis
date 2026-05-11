/**
 * services/tmdb.js
 * Capa de servicios para la API de The Movie Database.
 * Centraliza las peticiones y la configuración global de TMDB.
 */

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL
const IMAGE_URL = import.meta.env.VITE_TMDB_IMAGE_URL

/**
 * Función base para realizar peticiones fetch a TMDB.
 * @param {string} endpoint - Ruta del recurso (ej. /movie/popular).
 * @param {object} params - Parámetros de consulta adicionales.
 */
const fetchFromTMDB = async (endpoint, params = {}) => {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    language: 'es-ES',
    ...params,
  })

  try {
    const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`)
    
    if (!response.ok) {
      throw new Error(`TMDB Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Fetch error at ${endpoint}:`, error)
    throw error
  }
}

// --- Endpoints de Películas ---

export const getPopularMovies = (page = 1) => 
  fetchFromTMDB('/movie/popular', { page })

export const searchMovies = (query, page = 1) => 
  fetchFromTMDB('/search/movie', { query, page })

export const getMovieDetail = (movieId) => 
  fetchFromTMDB(`/movie/${movieId}`)

export const getMovieCredits = (movieId) => 
  fetchFromTMDB(`/movie/${movieId}/credits`)

export const getMovieVideos = (movieId) => 
  fetchFromTMDB(`/movie/${movieId}/videos`)

// --- Filtros y Descubrimiento ---

export const getGenres = () => 
  fetchFromTMDB('/genre/movie/list')

export const getMoviesByGenre = (genreId, page = 1) => 
  fetchFromTMDB('/discover/movie', {
    with_genres: genreId,
    sort_by: 'popularity.desc',
    page,
  })

// --- Utilidades de Imagen ---

export const getPosterUrl = (path, size = 'w500') => 
  path ? `${IMAGE_URL}/${size}${path}` : null

export const getBackdropUrl = (path) => 
  path ? `${IMAGE_URL}/original${path}` : null