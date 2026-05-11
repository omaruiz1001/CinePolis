import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FavoritesProvider } from './context/FavoritesContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Todo lo que esté dentro puede usar useFavorites() */}
    <FavoritesProvider>
      <App />
    </FavoritesProvider>
  </StrictMode>
)
