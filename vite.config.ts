import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // ExcelJS is loaded only after an Excel action and stays out of the initial bundle.
  build: { chunkSizeWarningLimit: 1000 },
})
