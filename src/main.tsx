import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import '@/styles/globals.css'
import App from '@/App'
import { ThemeProvider } from '@/hooks/useTheme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/ai_portfolio">
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
