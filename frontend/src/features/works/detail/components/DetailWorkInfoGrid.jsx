import { Calendar, Globe, BookMarked, Tag, Building2, Hash } from "lucide-react";

function formatDate(date) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}

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

export default function DetailWorkInfoGrid({ work }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border">
            <InfoRow icon={Building2} label="Editore" value={work.publisher?.name} />
            <InfoRow icon={Calendar} label="Pubblicazione" value={formatDate(work.publicationDate)} />
            <InfoRow icon={Globe} label="Lingua" value={work.language?.name} />
            <InfoRow
                icon={Hash}
                label="Codice Dewey"
                value={work.dewey ? `${work.dewey.code} — ${work.dewey.description}` : null}
            />
            <InfoRow icon={BookMarked} label="ISBN" value={work.id} />
            <InfoRow
                icon={Tag}
                label="Copie totali"
                value={work.items?.length > 0 ? String(work.items.length) : null}
            />
        </div>
    );
}