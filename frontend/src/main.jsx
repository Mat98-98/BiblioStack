import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "./App.css";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/context/AuthContext.jsx"

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ThemeProvider
            defaultTheme="system"
            storageKey="vite-ui-theme"
        >
            <AuthProvider>
                <App />
            </AuthProvider>
            <Toaster position="bottom-right" richColors />
        </ThemeProvider>
    </StrictMode>
);