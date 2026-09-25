import { X } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.jsx";
import {useCatalogFilters} from "@/features/works/catalog/hooks/useCatalogFilters.js";
import AppCombobox from "@/components/common/AppCombobox.jsx";


function FilterSection({ label, children }) {
    return (
        <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {label}
            </span>
            {children}
        </div>
    );
}

export default function CatalogFilters({ filters, onFilter, onClear, activeCount }) {
    const { genres, languages, publishers, loading: filtersLoading, open: openFilters } = useCatalogFilters();

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
                <AppCombobox
                    value={filters.genreId}
                    onChange={(v) => onFilter("genreId", v)}
                    items={genres}
                    loading={filtersLoading}
                    onOpen={openFilters}
                    placeholder="Tutti i generi"
                    searchPlaceholder="Cerca genere..."
                    getOptionValue={(g) => String(g.id)}
                    renderLabel={(g) => g.name}
                />
            </FilterSection>

            <FilterSection label="Lingua">
                <Select
                    value={filters.languageCode}
                    onOpenChange={(open) => { if (open) openFilters(); }}
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
                <AppCombobox
                    value={filters.publisherId}
                    onChange={(v) => onFilter("publisherId", v)}
                    items={publishers.items}
                    loading={publishers.loading}
                    hasMore={publishers.hasMore}
                    onOpen={publishers.open}
                    onLoadMore={publishers.loadMore}
                    onSearch={publishers.updateSearch}
                    placeholder="Tutti gli editori"
                    searchPlaceholder="Cerca editore..."
                    getOptionValue={(p) => String(p.id)}
                    renderLabel={(p) => p.name}
                />
            </FilterSection>

        </aside>
    )
}