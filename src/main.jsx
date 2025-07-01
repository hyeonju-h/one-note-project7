import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import './kindergarten-theme.css';

import "./index.css";  // ✅ index.css 연결

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
