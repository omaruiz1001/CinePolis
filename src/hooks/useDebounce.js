import { useState, useEffect } from 'react'

/**
 * useDebounce: Retrasa la actualización de un valor para optimizar 
 * el rendimiento y reducir llamadas innecesarias a APIs o efectos pesados.
 * * @param {any} value - El valor a observar (ej. texto de un input).
 * @param {number} delay - Tiempo de espera en milisegundos.
 * @returns {any} - El valor actualizado tras el periodo de espera.
 */
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: Cancela el timeout anterior si el valor cambia antes de que expire el tiempo.
    // Esto previene múltiples ejecuciones durante la escritura rápida.
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export default useDebounce