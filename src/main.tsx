import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import '@/styles/globals.css'
import App from '@/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/ai-portfolio">
      <App />
    </BrowserRouter>
  </StrictMode>,
)
