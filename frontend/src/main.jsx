import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "./App.css";
import "@/api/authInterceptor.js";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <ThemeProvider
                defaultTheme="system"
                storageKey="vite-ui-theme"
            >
                <AuthProvider>
                    <App />
                </AuthProvider>
                <Toaster position="bottom-right" richColors />
            </ThemeProvider>
        </GoogleOAuthProvider>
    </StrictMode>
);