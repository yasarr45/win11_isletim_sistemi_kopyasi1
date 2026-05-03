import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/win11_isletim_sistemi_kopyasi1/", // 👈 BUNU EKLEDİK
  plugins: [react()],
})