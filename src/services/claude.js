/**
 * services/claude.js
 * Integración con Groq Cloud API (Llama 3).
 * Proporciona recomendaciones personalizadas basadas en el historial y favoritos.
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const askClaude = async (messages, favorites = []) => {
  if (!GROQ_API_KEY) {
    throw new Error('La API Key de Groq no está configurada');
  }

  // Construcción dinámica del contexto del sistema
  const favoritesList = favorites.length > 0
    ? `Películas favoritas del usuario:\n${favorites.map(f => 
        `- ${f.title} (${f.release_date?.split('-')[0] || 'N/A'})`
      ).join('\n')}`
    : 'El usuario aún no tiene películas favoritas.';

  const systemPrompt = `Eres CineAI, un asistente experto en cine amigable y conciso.
Responde siempre en español (máximo 3 párrafos).
Contexto actual: ${favoritesList}
Usa esta información para personalizar tus recomendaciones de forma inteligente.`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 1024,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages // El historial ya viene con el formato {role, content}
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error?.message || `Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error('Groq Service Error:', error);
    throw error;
  }
};