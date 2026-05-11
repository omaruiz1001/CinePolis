import { useState, useRef, useEffect } from 'react'
import { useFavorites } from '../context/FavoritesContext'
import { askClaude } from '../services/claude'

const SUGGESTIONS = [
  '¿Qué película me recomiendas para hoy?',
  'Recomiéndame algo de terror',
  'Algo similar a mis favoritos',
  '¿Cuál es la mejor película de los 90s?',
]

/**
 * AIChat: Interfaz de conversación con CineAI.
 * Gestiona el historial de mensajes, scroll automático y sugerencias dinámicas.
 */
const AIChat = () => {
  const { favorites } = useFavorites()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll automático al recibir nuevos mensajes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus automático al abrir
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
  }, [isOpen])

  const sendMessage = async (text) => {
    const userText = text.trim()
    if (!userText || loading) return

    const userMessage = { role: 'user', content: userText }
    const updatedMessages = [...messages, userMessage]
    
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await askClaude(updatedMessages, favorites)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Lo siento, tuve un problema de conexión. ¿Podrías reintentar?' 
      }])
      console.error('Claude API Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <>
      {isOpen && (
        <section 
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
          style={{ maxHeight: '70vh' }}
        >
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-3 bg-zinc-800 border-b border-zinc-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-sm shadow-inner">🎬</div>
              <div>
                <p className="text-white text-sm font-semibold">CineAI</p>
                <p className="text-zinc-400 text-[10px] uppercase tracking-wider font-bold">
                  {favorites.length > 0 ? `${favorites.length} favoritos cargados` : 'Online'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {messages.length > 0 && (
                <button onClick={() => setMessages([])} className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors">Limpiar</button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors">✕</button>
            </div>
          </header>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 custom-scrollbar">
            {messages.length === 0 && (
              <WelcomeView favoritesCount={favorites.length} onSuggest={sendMessage} />
            )}

            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg} />
            ))}

            {loading && <LoadingBubble />}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <footer className="p-3 bg-zinc-800/50 border-t border-zinc-700">
            <div className="flex gap-2 items-end bg-zinc-700 rounded-xl p-1 border border-zinc-600 focus-within:border-red-500 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pregunta sobre cine..."
                rows={1}
                disabled={loading}
                className="flex-1 bg-transparent text-white placeholder-zinc-400 px-3 py-2 text-sm resize-none focus:outline-none disabled:opacity-50 max-h-24"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-400 transition-colors disabled:opacity-20"
              >
                ↑
              </button>
            </div>
          </footer>
        </section>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-xl transition-all duration-300 
          ${isOpen ? 'bg-zinc-800 rotate-90' : 'bg-red-500 hover:bg-red-400 hover:scale-110'}`}
      >
        {isOpen ? '✕' : '🎬'}
      </button>
    </>
  )
}

// --- Sub-componentes para Limpieza de Código ---

const WelcomeView = ({ favoritesCount, onSuggest }) => (
  <div className="text-center py-6 animate-in fade-in duration-700">
    <p className="text-3xl mb-3">🍿</p>
    <h3 className="text-white text-sm font-bold mb-1">CineAI Assistant</h3>
    <p className="text-zinc-500 text-xs mb-6 px-6">
      {favoritesCount > 0 
        ? `Tengo en cuenta tus ${favoritesCount} favoritos para mis recomendaciones.` 
        : 'Pregúntame por géneros, años o películas similares.'}
    </p>
    <div className="flex flex-col gap-2">
      {SUGGESTIONS.map((s, i) => (
        <button 
          key={i} 
          onClick={() => onSuggest(s)}
          className="mx-4 text-left px-3 py-2 rounded-lg bg-zinc-800 text-zinc-400 text-[11px] hover:bg-zinc-700 hover:text-white transition-all border border-zinc-700"
        >
          {s}
        </button>
      ))}
    </div>
  </div>
)

const ChatBubble = ({ message }) => {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
      <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed shadow-sm
        ${isUser ? 'bg-red-500 text-white rounded-tr-none' : 'bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-tl-none'}`}
      >
        {message.content}
      </div>
    </div>
  )
}

const LoadingBubble = () => (
  <div className="flex justify-start">
    <div className="bg-zinc-800 border border-zinc-700 px-3 py-3 rounded-2xl rounded-tl-none">
      <div className="flex gap-1.5 items-center">
        {[0, 0.15, 0.3].map((delay, i) => (
          <div 
            key={i} 
            className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" 
            style={{ animationDelay: `${delay}s` }} 
          />
        ))}
      </div>
    </div>
  </div>
)

export default AIChat