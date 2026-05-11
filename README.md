# 🎬 CineAI - Asistente de Películas Inteligente

CineAI es una aplicación web moderna diseñada para cinéfilos que buscan una experiencia personalizada. Utiliza la potencia de la IA para recomendarte qué ver basándose en tus gustos reales.

<img width="1589" height="896" alt="CineAI Dashboard Preview" src="https://github.com/user-attachments/assets/e614cc80-6ea6-426b-81ab-5ed3722de728" />

## ✨ Características

- 🔍 **Búsqueda Avanzada:** Encuentra cualquier película gracias a la integración con la API de TMDB.
- 🤖 **Chat con IA:** Un asistente basado en **Llama 3 (Groq)** que analiza tus favoritos para darte recomendaciones únicas.
- 📂 **Filtros por Género:** Explora el catálogo por categorías (Acción, Drama, Terror, etc.).
- ❤️ **Sistema de Favoritos:** Guarda tus películas preferidas. Los datos se mantienen aunque recargues la página (LocalStorage).
- 📱 **Diseño Responsive:** Optimizado para móviles y escritorio con **Tailwind CSS**.
- 🌓 **Interfaz Dark Mode:** Estética cinematográfica elegante y moderna.

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React.js + Vite
- **Estilos:** Tailwind CSS
- **Estado Global:** React Context API
- **Modelos de IA:** Llama 3.3 70b (vía Groq Cloud)
- **Datos de Cine:** TMDB API

## 🚀 Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto localmente:

1. **Clona el repositorio:**
   ```bash
   git clone [https://github.com/TU_USUARIO/NOMBRE_REPOSITORIO.git](https://github.com/TU_USUARIO/NOMBRE_REPOSITORIO.git)
   cd NOMBRE_REPOSITORIO

2. Instala las dependencias:

Bash
 npm install
 Configura las variables de entorno:
 Crea un archivo .env en la raíz del proyecto y añade tus credenciales:

 Fragmento de código
 VITE_TMDB_API_KEY=tu_api_key_de_tmdb
 VITE_TMDB_BASE_URL=[https://api.themoviedb.org/3](https://api.themoviedb.org/3)
 VITE_TMDB_IMAGE_URL=[https://image.tmdb.org/t/p](https://image.tmdb.org/t/p)
 VITE_GROQ_API_KEY=tu_api_key_de_groq
3.Inicia el servidor de desarrollo:

Bash
npm run dev
