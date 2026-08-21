import { Input } from "@/components/ui/input.jsx";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";

const STATUS_TABS = [
    { value: "all", label: "Tutti" },
    { value: "active", label: "Attivi" },
    { value: "overdue", label: "In ritardo" },
    { value: "returned", label: "Restituiti" },
];

export default function LoansFilters({
                                         search, onSearch,
                                         status, onStatus,
                                         sortBy, sortOrder, onSort,
                                     }) {
    const toggleSort = (field) => {
        if (sortBy === field) {
            onSort(field, sortOrder === "asc" ? "desc" : "asc");
        } else {
            onSort(field, "desc");
        }
    };

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Barra di ricerca e Filtri di Stato */}
            <div className="flex flex-wrap items-center gap-3 flex-1">
                <Input
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Cerca per opera, utente o codice copia..."
                    className="max-w-xs"
                />

                {/* Gruppo di filtri stile "Pill" / Tab */}
                <div className="flex items-center rounded-lg bg-muted p-1 border border-border">
                    {STATUS_TABS.map((tab) => {
                        const isActive = status === tab.value;
                        return (
                            <button
                                key={tab.value}
                                onClick={() => onStatus(tab.value)}
                                className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-xs font-medium transition-all ${
                                    isActive
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Pulsanti di ordinamento */}
            <div className="flex items-center gap-2">
                <Button
                    variant={sortBy === "loanDate" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => toggleSort("loanDate")}
                >
                    <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
                    Data {sortBy === "loanDate" && (sortOrder === "asc" ? "↑" : "↓")}
                </Button>

                <Button
                    variant={sortBy === "dueDate" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => toggleSort("dueDate")}
                >
                    <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
                    Scadenza {sortBy === "dueDate" && (sortOrder === "asc" ? "↑" : "↓")}
                </Button>
            </div>
        </div>
    );
}