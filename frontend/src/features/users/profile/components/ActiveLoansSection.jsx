import { BookOpen, Clock, AlertTriangle, PackageX } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { daysUntil, safeFormat } from "@/lib/dateUtils.js";
import { formatAuthors } from "@/lib/authorUtils.js";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.jsx";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item.jsx";
import { Link } from "react-router-dom";

function DueBadge({ dueDate }) {
    const days = daysUntil(dueDate, { noMax: true })

    if (days === null) return null

    if (days < 0)
        return (
            <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Scaduto da {Math.abs(days)}g
            </Badge>
        )

    if (days === 0)
        return (
            <Badge variant="outline" className="gap-1 border-warning text-warning">
                <Clock className="h-3 w-3" />
                Scade oggi
            </Badge>
        )

    if (days <= 3)
        return (
            <Badge variant="outline" className="gap-1 border-warning text-warning-foreground">
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
    const loanDate = safeFormat(loan.loanDate)
    const authors = formatAuthors(loan.item?.work?.authors);

    return (
        <Item
            variant="outline"
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-4 rounded-xl bg-secondary/30 p-4 hover:bg-secondary/50 transition-colors"
        >
            <ItemMedia
                variant="icon"
                className="h-10 w-10 shrink-0 rounded-xl bg-primary/10"
            >
                <BookOpen className="h-5 w-5 text-primary" />
            </ItemMedia>

            <ItemContent className="min-w-0">
                <ItemTitle className="w-full min-w-0 truncate">
                    {loan.item?.work?.title ?? "Titolo non disponibile"}
                    {authors && ` - ${authors}`}
                </ItemTitle>

                <ItemDescription className="min-w-0 truncate">
                    Preso in prestito il {loanDate}
                </ItemDescription>
            </ItemContent>

            <ItemActions className="shrink-0">
                <DueBadge dueDate={loan.dueDate} />
            </ItemActions>
        </Item>
    );
}

export default function ActiveLoansSection({ loans }) {

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Prestiti attivi</h2>
                <Link to="/loans?status=active&page=1" className="text-sm font-medium text-primary hover:underline">Vedi tutti</Link>
            </div>

            {loans.length === 0 ? (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PackageX />
                        </EmptyMedia>
                        <EmptyTitle>Nessun prestito attivo</EmptyTitle>
                    </EmptyHeader>
                </Empty>
            ) : (
                <div className="flex flex-col gap-2">
                    {loans.map((loan) => (
                        <LoanCard key={loan.id} loan={loan} />
                    ))}
                </div>
            )}
        </section>
    )
}