import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { VitaProvider } from './context.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VitaProvider>
      <App />
    </VitaProvider>
  </StrictMode>,
)
