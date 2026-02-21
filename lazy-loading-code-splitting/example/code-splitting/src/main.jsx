import React from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom"; // ✅ ADD THIS

import App from "./App.jsx";

const rootElement = document.getElementById("root");

const root = createRoot(rootElement);

root.render(
  <BrowserRouter>   {/* ✅ MUST wrap */}
    <App />
  </BrowserRouter>
);