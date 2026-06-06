import LoginHero from "@/features/auth/login/LoginHero.jsx";
import ForgotPasswordPanel from "@/features/auth/forgot-password/ForgotPasswordPanel.jsx";


export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
            <LoginHero />
            <div className="flex items-center justify-center p-8">
                <ForgotPasswordPanel />
            </div>
        </div>
    );
}