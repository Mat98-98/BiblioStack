import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field.jsx";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group.jsx";


const STATUS_TABS = [
    { value: "all", label: "Tutti" },
    { value: "active", label: "Attivi" },
    { value: "overdue", label: "In ritardo" },
    { value: "returned", label: "Restituiti" },
];


function SortButton({
                        field,
                        label,
                        sortBy,
                        sortOrder,
                        onSort,
                    }) {
    const active = sortBy === field;

    const handleClick = () => {
        if (active) {
            onSort(
                field,
                sortOrder === "asc" ? "desc" : "asc"
            );
        } else {
            onSort(field, "desc");
        }
    };

    return (
        <Button
            type="button"
            variant={active ? "secondary" : "outline"}
            size="sm"
            onClick={handleClick}
        >
            {active ? (
                sortOrder === "asc" ? (
                    <ArrowUp />
                ) : (
                    <ArrowDown />
                )
            ) : (
                <ArrowUpDown />
            )}

            {label}
        </Button>
    );
}


export default function LoansFilters({
                                         search,
                                         onSearch,
                                         status,
                                         onStatus,
                                         sortBy,
                                         sortOrder,
                                         onSort,
                                         searchPlaceholder = "Cerca...",
                                     }) {
    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <FieldGroup className="flex-1">
                <Field className="max-w-md">
                    <FieldLabel
                        htmlFor="loanSearch"
                        className="sr-only"
                    >
                        Cerca prestiti
                    </FieldLabel>

                    <InputGroup>
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>

                        <InputGroupInput
                            id="loanSearch"
                            value={search}
                            onChange={(event) =>
                                onSearch(event.target.value)
                            }
                            placeholder={searchPlaceholder}
                        />
                    </InputGroup>
                </Field>

                <div
                    className="flex w-fit items-center rounded-lg border border-border bg-muted p-1"
                    role="group"
                    aria-label="Stato prestito"
                >
                    {STATUS_TABS.map((tab) => {
                        const active = status === tab.value;

                        return (
                            <button
                                key={tab.value}
                                type="button"
                                onClick={() => onStatus(tab.value)}
                                aria-pressed={active}
                                className={[
                                    "inline-flex items-center justify-center",
                                    "rounded-md px-3 py-1.5",
                                    "text-xs font-medium",
                                    "transition-colors",
                                    active
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground",
                                ].join(" ")}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </FieldGroup>

            <div
                className="flex items-center gap-2"
                role="group"
                aria-label="Ordinamento prestiti"
            >
                <SortButton
                    field="loanDate"
                    label="Data prestito"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={onSort}
                />

                <SortButton
                    field="dueDate"
                    label="Scadenza"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={onSort}
                />
            </div>
        </div>
    );
}