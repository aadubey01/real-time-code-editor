import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
<<<<<<< HEAD
   
  },
  build:{
=======
    
  },
   build:{
>>>>>>> 2e65208d064ded0e2f403ef22eb16d968a64afa6
    outDir:'dist',
  }
})
