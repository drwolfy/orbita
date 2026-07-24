import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Órbita es 100 % estática y offline: no hay backend ni llamadas de red.
// Todo lo que la app necesita (familias y maniobras) viaja en el bundle.
/** Sello de compilación, para saber de un vistazo qué versión lleva el móvil. */
const VERSION = new Date().toISOString().slice(0, 16).replace('T', ' ')

export default defineConfig({
  define: {
    __VERSION__: JSON.stringify(VERSION),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // «prompt» en vez de «autoUpdate»: con autoUpdate el cambio solo entra en
      // el siguiente arranque, y en iOS una app añadida a la pantalla de inicio
      // se queda suspendida, así que ese arranque puede no llegar nunca. Aquí
      // lo comprobamos nosotros y aplicamos la versión nueva cuando toca (ver
      // componentes/Actualizacion.tsx).
      registerType: 'prompt',
      injectRegister: null,
      // Safari iOS no soporta el manifest para el icono de la pantalla de
      // inicio: lo coge del <link rel="apple-touch-icon"> de index.html.
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Órbita',
        short_name: 'Órbita',
        description: 'Juego social de deducción. Nadie miente; alguien orbita más lejos.',
        lang: 'es',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#080b14',
        theme_color: '#080b14',
        icons: [
          { src: 'icono-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icono-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icono-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Las fotos del modo imágenes entran en el precache: el juego funciona
        // sin red y una ronda a medias con la foto sin cargar no vale.
        globPatterns: ['**/*.{js,css,html,svg,png,webp,jpg,woff2}'],
        // Por defecto workbox deja fuera lo que pase de 2 MiB, y un trío de
        // fotos grandes se lo comería sin avisar.
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})
