import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { GoogleLogin } from "@react-oauth/google";
import { notify } from "@/lib/notify.js";
import { useLogin } from "@/features/auth/login/useLogin.js";
import EmailField from "@/features/auth/components/EmailField.jsx";
import PasswordField from "@/features/auth/components/PasswordField.jsx";


export default function LoginPanel({}) {

    const {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        login
    } = useLogin();

    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita refresh del form
        await login();
    }

    return (
        <div className="w-full max-w-md space-y-6">

            {/* HEADER */}
            <div className="text-center space-y-1">
                <h2 className="text-2xl font-semibold">Bentornato</h2>
                <p className="text-sm text-muted-foreground">
                    Accedi al tuo account
                </p>
            </div>

            {/* LOGIN GOOGLE */}
            <div className="flex justify-center w-full">
                <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                        try {
                            // credentialResponse.credential è il tuo idToken
                            await loginWithGoogle(credentialResponse.credential);
                            notify.success("Accesso con Google effettuato");
                            navigate("/", { replace: true });
                        } catch (error) {
                            // Gli errori dell'API vengono già gestiti dall'interceptor o da handleApiError
                            notify.error("Errore durante l'accesso con Google nel server");
                        }
                    }}
                    onError={() => {
                        notify.error("Login con Google fallito o annullato");
                    }}
                    useOneTap // Mostra un popup in alto a destra se l'utente ha già loggato prima!
                    shape="pill"
                    theme="outline" // Puoi cambiare il tema (es. 'filled_blue' o 'filled_black')
                    width="100%"
                />
            </div>

            {/* SEPARATORE */}
            <div className="flex items-center gap-6">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">oppure</span>
                <Separator className="flex-1" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* EMAIL */}
                <EmailField
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* PASSWORD */}
                <div className="space-y-2">
                    <PasswordField
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="flex justify-end">
                        <Link
                            to="/forgot-password"
                            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                        >
                            Password dimenticata?
                        </Link>
                    </div>
                </div>

                {/* BOTTONE SUBMIT LOGIN */}
                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? "Accesso..." : (
                        <>
                            Accedi
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>

            </form>
        </div>
    )
}