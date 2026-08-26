import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils.js";
import { Button } from "@/components/ui/button.jsx";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command.jsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.jsx";

// Raggruppa le location per nome scuola
const groupBySchool = (locations) =>
    locations.reduce((acc, loc) => {
        const school = loc.school?.name ?? "Senza scuola";
        if (!acc[school]) acc[school] = [];
        acc[school].push(loc);
        return acc;
    }, {});

export default function LocationSelect({ locations, value, onValueChange, placeholder = "Seleziona una posizione" }) {
    const [open, setOpen] = useState(false);
    const grouped = groupBySchool(locations);

    // Trova l'etichetta dell'elemento attualmente selezionato
    const selectedLocation = locations.find((l) => String(l.id) === String(value));
    const selectedLabel = selectedLocation
        ? (selectedLocation.shelfCode ?? `Scaffale ${selectedLocation.id}`)
        : null;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal"
                >
                    <span className="truncate">
                        {selectedLabel || placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Cerca posizione o scaffale..." />
                    <CommandList>
                        <CommandEmpty>Nessuna posizione trovata.</CommandEmpty>
                        {Object.entries(grouped).map(([school, locs], index, arr) => {
                            const labelGroup = Object.entries(grouped);
                            return (
                                <div key={school}>
                                    <CommandGroup heading={school}>
                                        {locs.map((loc) => {
                                            const label = loc.shelfCode ?? `Scaffale ${loc.id}`;
                                            const isSelected = String(value) === String(loc.id);

                                            return (
                                                <CommandItem
                                                    key={loc.id}
                                                    value={`${school} ${label}`} // Permette la ricerca anche filtrando per nome scuola
                                                    onSelect={() => {
                                                        onValueChange(loc.id ? Number(loc.id) : null);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            isSelected ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {label}
                                                </CommandItem>
                                            );
                                        })}
                                    </CommandGroup>
                                    {/* Aggiunge il separatore tra le scuole, ma non dopo l'ultima */}
                                    {index < arr.length - 1 && <CommandSeparator />}
                                </div>
                            );
                        })}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}