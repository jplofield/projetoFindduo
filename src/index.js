import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HashRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Defina o `basename` para produção e deixe vazio em desenvolvimento
const basename = process.env.NODE_ENV === "production" ? "/projetoFindduo" : "";

root.render(
  <React.StrictMode>
    <HashRouter basename={basename}>
      <App />
    </HashRouter>
  </React.StrictMode>
);

reportWebVitals();
