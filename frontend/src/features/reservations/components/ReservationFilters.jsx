import { Input } from "@/components/ui/input.jsx";
import { Field, FieldLabel } from "@/components/ui/field.jsx";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";

const STATUS_TABS = [
    { value: "all", label: "Tutte" },
    { value: "pending", label: "In attesa" },
    { value: "ready", label: "Disponibili per il ritiro" },
    { value: "fulfilled", label: "Ritirate" },
    { value: "expired", label: "Scadute" },
    { value: "cancelled", label: "Annullate" },
];

// isStaff: cambia solo il placeholder della ricerca
export default function ReservationFilters({
                                               search, onSearch,
                                               status, onStatus,
                                               sortOrder, onSort,
                                               isStaff = true,
                                           }) {
    const toggleSort = () => onSort(sortOrder === "asc" ? "desc" : "asc");

    const searchPlaceholder = isStaff
        ? "Cerca per titolo..."
        : "Cerca per titolo...";

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3 flex-1">
                <Field className="max-w-xs">
                    <FieldLabel htmlFor="reservationSearch" className="sr-only">
                        Cerca prenotazioni
                    </FieldLabel>
                    <Input
                        id="reservationSearch"
                        value={search}
                        onChange={(e) => onSearch(e.target.value)}
                        placeholder={searchPlaceholder}
                    />
                </Field>

                <div className="flex items-center rounded-lg bg-muted p-1 border border-border flex-wrap">
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

            <Button variant="outline" size="sm" onClick={toggleSort}>
                <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
                Data prenotazione {sortOrder === "asc" ? "↑" : "↓"}
            </Button>
        </div>
    );
}