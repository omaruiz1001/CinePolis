import { useState, useCallback } from 'react'
import Navbar     from './components/Navbar'
import MovieModal from './components/MovieModal'
import AIChat     from './components/AIChat'
import Home       from './pages/Home'
import Favorites  from './pages/Favorites'

const App = () => {
  const [currentPage, setCurrentPage]     = useState('home')
  const [searchQuery, setSearchQuery]     = useState('')
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [selectedMovie, setSelectedMovie] = useState(null)

  const handleSearch = useCallback((query) => {
    setSearchQuery(query)
    if (query) setSelectedGenre(null)
  }, [])

  const handleGenreChange = useCallback((genreId) => {
    setSelectedGenre(genreId)
    if (genreId) setSearchQuery('')
  }, [])

  const handleSelectMovie  = useCallback((movie) => setSelectedMovie(movie), [])
  const handleCloseModal   = useCallback(() => setSelectedMovie(null), [])
  const handlePageChange   = useCallback((page) => {
    setCurrentPage(page)
    setSearchQuery('')
    setSelectedGenre(null)
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar
        onSearch={handleSearch}
        onGenreChange={handleGenreChange}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      <div className={currentPage === 'home' ? 'pt-28' : 'pt-20'}>
        {currentPage === 'home' ? (
          <Home
            searchQuery={searchQuery}
            selectedGenre={selectedGenre}
            onSelectMovie={handleSelectMovie}
          />
        ) : (
          <Favorites onSelectMovie={handleSelectMovie} />
        )}
      </div>
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
      <AIChat />
    </div>
  )
}

export default App