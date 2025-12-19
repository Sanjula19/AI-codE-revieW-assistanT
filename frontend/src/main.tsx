import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './providers/AuthProvider' // Import this
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>  {/* Add this wrapper */}
      <App />
    </AuthProvider> {/* Close wrapper */}
  </React.StrictMode>,
)