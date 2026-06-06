import { BookOpen, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";

function daysUntil(date) {
    if (!date) return null;
    const diff = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))
    return diff;
}

function DueBadge({ dueDate }) {
    const days = daysUntil(dueDate)

    if (days === null) return null

    if (days < 0)
        return (
            <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Scaduto da {Math.abs(days)}g
            </Badge>
        )

    if (days <= 3)
        return (
            <Badge variant="outline" className="gap-1 border-orange-500 text-orange-500">
                <Clock className="h-3 w-3" />
                Scade tra {days}g
            </Badge>
        )

    return (
        <Badge variant="outline" className="gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            Scade tra {days}g
        </Badge>
    )
}

function LoanCard({ loan }) {
    const loanDate = new Date(loan.loanDate).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })

    return (
        <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
            </div>

            <div className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="font-medium truncate">
                    {loan.item?.work?.title ?? "Titolo non disponibile"}
                </span>
                <span className="text-xs text-muted-foreground">
                    Preso in prestito il {loanDate}
                </span>
            </div>

            <DueBadge dueDate={loan.dueDate} />
        </div>
    )
}

export default function ActiveLoans({ loans }) {
    const active = loans.filter((l) => !l.returnDate)

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Prestiti attivi</h2>
                <span className="text-sm text-muted-foreground">{active.length} in corso</span>
            </div>

            {active.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground rounded-2xl border border-dashed border-border">
                    <BookOpen className="h-8 w-8 mb-2 opacity-40" />
                    <span className="text-sm">Nessun prestito attivo</span>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {active.map((loan) => (
                        <LoanCard key={loan.id} loan={loan} />
                    ))}
                </div>
            )}
        </section>
    )
}