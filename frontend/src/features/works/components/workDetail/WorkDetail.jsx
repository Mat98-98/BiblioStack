import { BookOpen, Calendar, Globe, BookMarked, Tag, Building2, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { useState } from "react";

function formatDate(date) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

/*
    @ todo 1. fix numero copie disponibili -> creare query/view che restituisca il numero di copie che non sono in prestito o prenotate;
    @ todo 2. aggiungere la lista delle copie relative all'opera con il relativo stato (reserved, loaned, available) + posizione nella biblioteca
*/

function InfoRow({ icon: Icon, label, value }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-sm font-medium">{value}</span>
            </div>
        </div>
    );
}

function WorkDetailSkeleton() {
    return (
        <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="w-48 h-72 rounded-2xl shrink-0 mx-auto md:mx-0" />
            <div className="flex flex-col gap-4 flex-1">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <div className="flex flex-col gap-3 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-8 w-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function WorkDetail({ work, loading, error }) {
    const [expanded, setExpanded] = useState(false)

    if (loading) return <WorkDetailSkeleton />;

    if (error || !work) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                <BookOpen className="h-10 w-10 mb-3 opacity-30" />
                <span className="text-sm">Opera non trovata</span>
            </div>
        );
    }

    const authors =
        work.authors?.map(a => `${a.firstName} ${a.lastName}`).join(", ") || "—"

    const available = work.items?.length ?? 0

    const MAX_LENGTH = 300
    const isLong = work.description?.length > MAX_LENGTH

    const displayedText =
        expanded || !isLong
            ? work.description
            : work.description?.slice(0, MAX_LENGTH) + "...";

    return (
        <div className="flex flex-col gap-6 pt-12">

            {/* Sezione superiore */}
            <div className="flex flex-col md:flex-row gap-8">

                {/* Cover */}
                <div className="shrink-0 mx-auto md:mx-0">
                    {work.coverUrl ? (
                        <img
                            src={work.coverUrl}
                            alt={work.title}
                            className="w-48 rounded-2xl object-cover shadow-md"
                        />
                    ) : (
                        <div className="w-48 h-72 rounded-2xl bg-secondary flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-5 flex-1 min-w-0">

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold leading-tight">
                            {work.title}
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            {authors}
                        </p>
                    </div>

                    {/* Generi */}
                    {work.genres?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {work.genres.map(g => (
                                <Badge key={g.id} variant="secondary">
                                    {g.name}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Disponibilità */}
                    <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium w-fit ${
                            available > 0
                                ? "bg-green-500/10 text-green-600"
                                : "bg-destructive/10 text-destructive"
                        }`}
                    >
                        <div
                            className={`h-2 w-2 rounded-full ${
                                available > 0
                                    ? "bg-green-500"
                                    : "bg-destructive"
                            }`}
                        />
                        {available > 0
                            ? `${available} cop${
                                available === 1 ? "ia" : "ie"
                            } disponibili`
                            : "Non disponibile"}
                    </div>

                    {/* Dettagli */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border">
                        <InfoRow
                            icon={Building2}
                            label="Editore"
                            value={work.publisher?.name}
                        />
                        <InfoRow
                            icon={Calendar}
                            label="Pubblicazione"
                            value={formatDate(work.publicationDate)}
                        />
                        <InfoRow
                            icon={Globe}
                            label="Lingua"
                            value={work.language?.name}
                        />
                        <InfoRow
                            icon={Hash}
                            label="Codice Dewey"
                            value={
                                work.dewey
                                    ? `${work.dewey.code} — ${work.dewey.description}`
                                    : null
                            }
                        />
                        <InfoRow
                            icon={BookMarked}
                            label="ISBN"
                            value={work.id}
                        />
                        <InfoRow
                            icon={Tag}
                            label="Copie totali"
                            value={
                                work.items?.length > 0
                                    ? String(work.items.length)
                                    : null
                            }
                        />
                    </div>
                </div>
            </div>

            {/* DESCRIPTION (FULL WIDTH) */}
            {work.description && (
                <div className="w-full border-t pt-12">
                    <h2 className="text-xl font-semibold text-muted-foreground mb-2">
                        Descrizione
                    </h2>

                    <p className="text-sm leading-relaxed text-foreground pt-4">
                        {displayedText}
                    </p>

                    {isLong && (
                        <button
                            onClick={() => setExpanded(v => !v)}
                            className="mt-2 text-sm font-medium text-primary hover:underline"
                        >
                            {expanded ? "Mostra meno" : "Leggi di più"}
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}