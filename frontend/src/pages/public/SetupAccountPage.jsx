import LoginHero from "@/features/auth/login/LoginHero.jsx";
import SetPasswordPanel from "@/features/auth/set-password/SetPasswordPanel.jsx";


export default function SetupAccountPage() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
            <LoginHero />
            <div className="flex items-center justify-center p-8">
                <SetPasswordPanel mode="setup" />
            </div>
        </div>
    );
}