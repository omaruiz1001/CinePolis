import { createContext, useContext, useState, useEffect, useMemo } from 'react'

const FavoritesContext = createContext(null)

/**
 * FavoritesProvider: Gestiona el estado global de favoritos y su persistencia.
 * Utiliza localStorage para mantener los datos tras recargar la página.
 */
export const FavoritesProvider = ({ children }) => {
  // Inicialización perezosa (lazy) para optimizar el rendimiento al cargar la app
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('cineai_favorites')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error inicializando favoritos:', error)
      return []
    }
  })

  // Sincronización automática con localStorage ante cualquier cambio en el estado
  useEffect(() => {
    try {
      localStorage.setItem('cineai_favorites', JSON.stringify(favorites))
    } catch (error) {
      console.warn('Error en persistencia:', error)
    }
  }, [favorites])

  const addFavorite = (movie) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === movie.id)) return prev
      return [...prev, movie]
    })
  }

  const removeFavorite = (movieId) => {
    setFavorites(prev => prev.filter(fav => fav.id !== movieId))
  }

  const isFavorite = (movieId) => favorites.some(fav => fav.id === movieId)

  const toggleFavorite = (movie) => {
    isFavorite(movie.id) ? removeFavorite(movie.id) : addFavorite(movie)
  }

  // useMemo evita que los componentes hijos se rendericen innecesariamente 
  // si el valor del contexto no ha cambiado realmente.
  const value = useMemo(() => ({
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    favoritesCount: favorites.length
  }), [favorites])

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

/**
 * Hook personalizado para acceder de forma sencilla al estado de favoritos.
 */
export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  
  if (!context) {
    throw new Error('useFavorites debe utilizarse dentro de un FavoritesProvider')
  }
  
  return context
}