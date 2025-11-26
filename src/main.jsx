import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('severviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
    navigator.serviceWorker
    .register('/service-worker.js')
    .then(registration => console.log('SW registered: ', registration))
    .catch(error => console.log('SW registration failed: ', error));
  });
}