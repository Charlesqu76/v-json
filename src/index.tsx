import React from "react";
import App from "./app";
import "./styles/index.css";

import { createRoot } from "react-dom/client";
const container = document.getElementById("app");
const root = createRoot(container!);
root.render(<App />);
