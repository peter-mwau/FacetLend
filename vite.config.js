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
      name: "Facetlend",
      short_name: "FL",
      description: "Unlock every facet of your borrowing power.",
      start_url: "/",
      scope: "/",
      display: "standalone",
      orientation: "portrait",
      background_color: "#ffffff",
      theme_color: "#000000",
      icons: [
        {
          src: "icons/icon-48x48.png",
          sizes: "48x48",
          type: "image/png"
        },
        {
          src: "icons/icon-72x72.png",
          sizes: "72x72",
          type: "image/png"
        },
        {
          src: "icons/icon-96x96.png",
          sizes: "96x96",
          type: "image/png"
        },
        {
          src: "icons/icon-128x128.png",
          sizes: "128x128",
          type: "image/png"
        },
        {
          src: "icons/icon-144x144.png",
          sizes: "144x144",
          type: "image/png"
        },
        {
          src: "icons/icon-152x152.png",
          sizes: "152x152",
          type: "image/png"
        },
        {
          src: "icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "icons/icon-256x256.png",
          sizes: "256x256",
          type: "image/png"
        },
        {
          src: "icons/icon-384x384.png",
          sizes: "384x384",
          type: "image/png"
        },
        {
          src: "icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    }
  })
  ],
})
