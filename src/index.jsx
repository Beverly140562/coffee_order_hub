import React from "react";
import React from "react/client";
import { BrowserRouter as Router } from "react-router";
import App from "./App";
import "./index.css";
import * as serviceWorker from "../public/serviceWorker";

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

