import { BookOpen } from "lucide-react";

export default function LoginHero() {
    return (
        <div className="hidden lg:flex flex-col justify-between p-12 bg-primary text-primary-foreground">

            <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                <span className="font-bold text-lg">BiblioStack</span>
            </div>

            <div className="space-y-4">
                <h1 className="text-4xl font-bold leading-tight">
                    La biblioteca smart del tuo istituto
                </h1>
                <p className="text-primary-foreground/70 text-lg">
                    Prenota, cerca e gestisci i tuoi prestiti in pochi tap.
                </p>
            </div>

            <p className="text-sm text-primary-foreground/50">
                © 2026 BiblioStack
            </p>

        </div>
    )
}