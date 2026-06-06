import { Link } from "react-router-dom";

import { ArrowRight, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button.jsx";
import { useSetPassword } from "@/features/auth/set-password/useSetPassword.js";
import PasswordField from "@/features/auth/components/PasswordField.jsx";

const COPY = {
    reset: {
        title: "Nuova password",
        subtitle: "Scegli una password sicura per il tuo account.",
        submit: "Reimposta password",
        submitting: "Salvataggio...",
        invalidSubtitle: "Il link di reset è scaduto o non è valido.",
        invalidCta: "Richiedi un nuovo link",
        invalidHref: "/forgot-password",
    },
    setup: {
        title: "Configura la password",
        subtitle: "Crea una password per attivare il tuo account BiblioStack.",
        submit: "Attiva account",
        submitting: "Attivazione...",
        invalidSubtitle: "Il link di attivazione è scaduto o non è valido. Contatta un amministratore per riceverne uno nuovo.",
        invalidCta: null,
        invalidHref: null,
    },
};

// mode: "reset" | "setup"
export default function SetPasswordPanel({ mode = "reset" }) {
    const {
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        loading,
        token,
        submit,
    } = useSetPassword(mode);

    const copy = COPY[mode];

    const handleSubmit = async (e) => {
        e.preventDefault();
        await submit();
    };

    if (!token) {
        return (
            <div className="w-full max-w-md space-y-6 text-center">
                <div className="flex justify-center">
                    <div className="rounded-full bg-destructive/10 p-4">
                        <ShieldAlert className="h-8 w-8 text-destructive" />
                    </div>
                </div>

                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold">Link non valido</h2>
                    <p className="text-sm text-muted-foreground">{copy.invalidSubtitle}</p>
                </div>

                {copy.invalidHref && (
                    <Link
                        to={copy.invalidHref}
                        className="inline-block text-sm font-medium underline underline-offset-4 hover:text-primary transition-colors"
                    >
                        {copy.invalidCta}
                    </Link>
                )}
            </div>
        );
    }

    return (
        <div className="w-full max-w-md space-y-6">

            <div className="text-center space-y-1">
                <h2 className="text-2xl font-semibold">{copy.title}</h2>
                <p className="text-sm text-muted-foreground">{copy.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

                <PasswordField
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <PasswordField
                    label="Conferma password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <Button type="submit" className="w-full" disabled={ loading || !password || !confirmPassword }>
                    {loading ? copy.submitting : (
                        <>
                            {copy.submit}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>

            </form>

        </div>
    );
}