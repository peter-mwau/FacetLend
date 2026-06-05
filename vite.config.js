import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Remove problematic pure annotations from dependencies that break rolldown
const stripPure = () => ({
  name: 'strip-pure-annotations',
  enforce: 'pre',
  transform(code, id) {
    if (!id || !(id.includes('/node_modules/') || id.includes('\\node_modules\\'))) return null
    const cleaned = code.replace(/\/\*\s*#?__PURE__\s*\*\//g, '')
    if (cleaned === code) return null
    return { code: cleaned, map: null }
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), stripPure(),
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'icons.svg', 'apple-touch-icon.png'],
    workbox: {
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    },
    manifest: {
      name: 'FacetLend',
      short_name: 'FacetLend',
      build: {
        chunkSizeWarningLimit: 3000,
      },
      description: 'Unlock every facet of your borrowing power. ',
      theme_color: '#1a202c',
      icons: [
        {
          src: 'facetlend_logo.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    }
  })
  ],
})
