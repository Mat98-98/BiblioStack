import { BookCheck, BookX } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";

function formatDate(date) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function HistoryCard({ loan }) {
    const returned = !!loan.returnDate
    const late = loan.returnDate && loan.dueDate && new Date(loan.returnDate) > new Date(loan.dueDate)

    return (
        <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-secondary/30">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${returned ? "bg-green-500/10" : "bg-destructive/10"}`}>
                {returned
                    ? <BookCheck className="h-5 w-5 text-green-500" />
                    : <BookX className="h-5 w-5 text-destructive" />
                }
            </div>

            <div className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="font-medium truncate">
                    {loan.item?.work?.title ?? "Titolo non disponibile"}
                </span>
                <span className="text-xs text-muted-foreground">
                    {formatDate(loan.loanDate)} → {formatDate(loan.returnDate)}
                </span>
            </div>

            {late && (
                <Badge variant="outline" className="border-orange-500 text-orange-500 shrink-0">
                    In ritardo
                </Badge>
            )}
        </div>
    )
}

export default function LoanHistory({ loans }) {
    const history = loans.filter((l) => l.returnDate)

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Storico prestiti</h2>
                <span className="text-sm text-muted-foreground">{history.length} totali</span>
            </div>

            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground rounded-2xl border border-dashed border-border">
                    <BookCheck className="h-8 w-8 mb-2 opacity-40" />
                    <span className="text-sm">Nessun prestito passato</span>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {history.map((loan) => (
                        <HistoryCard key={loan.id} loan={loan} />
                    ))}
                </div>
            )}
        </section>
    )
}