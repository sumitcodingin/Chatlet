if (typeof window !== "undefined") {
  const saved = localStorage.getItem("chat-theme") || "coffee";
  document.documentElement.setAttribute("data-theme", saved);
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  
    <BrowserRouter>
      <App />
    </BrowserRouter>

);