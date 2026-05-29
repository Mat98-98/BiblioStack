import React from "react";
import LoginHero from "@/features/auth/LoginHero"
import LoginPanel from "@/features/auth/LoginPanel.jsx";

export default function LoginPage() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[2fr_3fr]">

                <LoginHero />
            <div className="flex items-center justify-center p-8">
                <LoginPanel />
            </div>
        </div>
    );
}