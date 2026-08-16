import { X } from "lucide-react"
import { Button } from "@/components/ui/button.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.jsx"

function FilterSection({ label, children }) {
    return (
        <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {label}
            </span>
            {children}
        </div>
    )
}

export default function CatalogFilters({ filters, genres, languages, publishers, onFilter, onClear, activeCount }) {
    return (
        <aside className="space-y-6">

            <div className="flex items-center justify-between">
                <span className="font-semibold">Filtri</span>
                {activeCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={onClear} className="h-7 gap-1 text-xs">
                        <X className="h-3 w-3" />
                        Cancella ({activeCount})
                    </Button>
                )}
            </div>

            <FilterSection label="Genere">
                <Select
                    value={filters.genreId}
                    onValueChange={v => onFilter("genreId", v === "all" ? "" : v)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Tutti i generi" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tutti i generi</SelectItem>
                        {genres.map(g => (
                            <SelectItem key={g.id} value={String(g.id)}>
                                {g.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FilterSection>

            <FilterSection label="Lingua">
                <Select
                    value={filters.languageCode}
                    onValueChange={v => onFilter("languageCode", v === "all" ? "" : v)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Tutte le lingue" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tutte le lingue</SelectItem>
                        {languages.map(l => (
                            <SelectItem key={l.languageCode} value={l.languageCode}>
                                {l.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FilterSection>

            <FilterSection label="Editore">
                <Select
                    value={filters.publisherId}
                    onValueChange={v => onFilter("publisherId", v === "all" ? "" : v)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Tutti gli editori" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tutti gli editori</SelectItem>
                        {publishers.map(p => (
                            <SelectItem key={p.id} value={String(p.id)}>
                                {p.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FilterSection>

        </aside>
    )
}