import { ArrowRight, MailCheck, Clock } from "lucide-react";

import { Button } from "@/components/ui/button.jsx";
import { useForgotPassword } from "@/features/auth/forgot-password/useForgotPassword.js";
import EmailField from "@/features/auth/components/EmailField.jsx";

const TOTAL_SECONDS = 10 * 60;

const formatCountdown = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
};

function CountdownBar({ secondsRemaining }) {
    const progress = (secondsRemaining / TOTAL_SECONDS) * 100;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    Puoi richiedere un nuovo link tra
                </span>
                <span className="font-medium tabular-nums text-foreground">
                    {formatCountdown(secondsRemaining)}
                </span>
            </div>

            {/* Barra di progresso */}
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                    className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}

export default function ForgotPasswordPanel() {
    const { email, setEmail, loading, sent, setSent, secondsRemaining, sendResetLink } = useForgotPassword();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await sendResetLink();
    };

    const isRateLimited = secondsRemaining > 0;

    if (sent) {
        return (
            <div className="w-full max-w-md space-y-6 text-center">
                <div className="flex justify-center">
                    <div className="rounded-full bg-primary/10 p-4">
                        <MailCheck className="h-8 w-8 text-primary" />
                    </div>
                </div>

                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold">Controlla la tua email</h2>
                    <p className="text-sm text-muted-foreground">
                        Abbiamo inviato un link a{" "}
                        <span className="font-medium text-foreground">{email}</span>.
                        <br />
                        Segui le istruzioni per reimpostare la password.
                    </p>
                </div>

                {/* Countdown visibile anche nella schermata di conferma */}
                {isRateLimited && (
                    <div className="rounded-lg border bg-muted/40 p-4">
                        <CountdownBar secondsRemaining={secondsRemaining} />
                    </div>
                )}

                {!isRateLimited && (
                    <p className="text-xs text-muted-foreground">
                        Non hai ricevuto nulla? Controlla la cartella spam o{" "}
                        <button
                            type="button"
                            onClick={() => setSent(false)}
                            className="underline underline-offset-4 hover:text-foreground transition-colors"
                        >
                            riprova
                        </button>
                        .
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="w-full max-w-md space-y-6">

            <div className="text-center space-y-1">
                <h2 className="text-2xl font-semibold">Password dimenticata?</h2>
                <p className="text-sm text-muted-foreground">
                    Inserisci la tua email e ti invieremo un link per reimpostarla.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

                <EmailField
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Countdown visibile anche nel form se rate limited */}
                {isRateLimited && <CountdownBar secondsRemaining={secondsRemaining} />}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || isRateLimited}
                >
                    {loading ? "Invio in corso..." : isRateLimited ? (
                        <>
                            <Clock className="mr-2 h-4 w-4" />
                            Attendi {formatCountdown(secondsRemaining)}
                        </>
                    ) : (
                        <>
                            Invia link di reset
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>

            </form>

            <p className="text-center text-sm text-muted-foreground">
                Ricordi la password?{" "}
                <a
                    href="/login"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                >
                    Accedi
                </a>
            </p>

        </div>
    );
}