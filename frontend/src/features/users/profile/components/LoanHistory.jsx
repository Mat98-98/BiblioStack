import { ArrowRight, BookCheck, BookX, PackageX } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { formatAuthors } from "@/lib/authorUtils.js";
import { formatDateShort } from "@/lib/dateUtils.js";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.jsx";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item.jsx";
import { Link } from "react-router-dom";

function HistoryCard({ loan }) {
    const late = loan.returnDate && loan.dueDate && new Date(loan.returnDate) > new Date(loan.dueDate)
    const authors = formatAuthors(loan.item?.work?.authors);

    return (
        <Item
            variant="outline"
            className="grid grid-cols-[auto_minmax(0,1fr)_max-content] items-center gap-4 rounded-xl bg-secondary/30"
        >
            <ItemMedia
                variant="icon"
                className={`h-10 w-10 shrink-0 rounded-xl ${
                    late ? "bg-warning/10" : "bg-success/10"
                }`}
            >
                {late ? (
                    <BookX className="h-5 w-5 text-warning" />
                ) : (
                    <BookCheck className="h-5 w-5 text-success" />
                )}
            </ItemMedia>

            <ItemContent className="min-w-0 gap-1">
                <ItemTitle className="w-full min-w-0 truncate">
                    {loan.item?.work?.title ?? "Titolo non disponibile"}
                    {authors && ` - ${authors}`}
                </ItemTitle>

                <ItemDescription className="flex items-center gap-2 truncate">
                    <span>{formatDateShort(loan.loanDate)}</span>
                    <ArrowRight className="h-3 w-3 shrink-0" />
                    <span>{formatDateShort(loan.returnDate)}</span>
                </ItemDescription>
            </ItemContent>

            {late && (
                <div className="shrink-0">
                    <Badge variant="outline" className="border-warning text-warning">
                        In ritardo
                    </Badge>
                </div>
            )}
        </Item>
    )
}

export default function LoanHistory({ loans }) {
   return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Storico prestiti</h2>
                <Link to="/loans?status=returned&page=1" className="text-sm font-medium text-primary hover:underline">Vedi tutti</Link>
            </div>

            {loans.length === 0 ? (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PackageX />
                        </EmptyMedia>
                        <EmptyTitle>Nessun prestito passato</EmptyTitle>
                    </EmptyHeader>
                </Empty>
            ) : (
                <div className="flex flex-col gap-2">
                    {loans.map((loan) => (
                        <HistoryCard key={loan.id} loan={loan} />
                    ))}
                </div>
            )}
        </section>
    )
}