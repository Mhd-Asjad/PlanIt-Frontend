import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {Toaster } from 'sonner'
import { AuthProvider } from './context/AuthProvider.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster position='top-right' />
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)
// redeploy trigger