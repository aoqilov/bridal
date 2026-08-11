import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CusToastProvider } from "@/components/ui";
import { useThemeStore } from "@/store/zustand";
import "./index.css";

useThemeStore.getState().init();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CusToastProvider>
        <App />
      </CusToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
