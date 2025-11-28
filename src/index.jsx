import React from "react";
import React from "react/client";
import { BrowserRouter as Router } from "react-router";
import App from "./App";
import "./index.css";

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/serviceWorker.js')
      .then(() => console.log('Service Worker registered'))
      .catch(err => console.error('SW registration failed:', err));
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

// Register service worker for PWA
serviceWorker.register();


