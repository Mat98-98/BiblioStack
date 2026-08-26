import { useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils.js";
import { Button } from "@/components/ui/button.jsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover.jsx";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command.jsx";

export default function AppCombobox({
                                        value,                      // Il valore attualmente selezionato (es. id, codice, stringa)
                                        onChange,                   // Callback al cambiamento
                                        items = [],                 // Array di elementi da mostrare
                                        loading = false,            // Stato di caricamento
                                        placeholder = "Seleziona...",
                                        searchPlaceholder = "Cerca...",
                                        getOptionValue,             // Funzione per estrarre l'ID/chiave univoca dall'item (es. item => item.id)
                                        renderLabel,                // Funzione per mostrare il testo nell'elenco (es. item => item.name)
                                        renderSelected,             // Funzione opzionale per mostrare il testo sul bottone quando selezionato
                                        className = ""
                                    }) {
    const [open, setOpen] = useState(false);

    // Trova l'elemento attualmente selezionato
    const selectedItem = items.find(item => getOptionValue(item) === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between font-normal", className)}
                >
                    {selectedItem ? (
                        <span className="truncate">
                            {renderSelected ? renderSelected(selectedItem) : renderLabel(selectedItem)}
                        </span>
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList>
                        {loading && (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        )}

                        {!loading && items.length === 0 && (
                            <CommandEmpty>Nessun risultato.</CommandEmpty>
                        )}

                        {!loading && items.length > 0 && (
                            <CommandGroup>
                                {items.map(item => {
                                    const itemId = getOptionValue(item);
                                    const isSelected = itemId === value;

                                    return (
                                        <CommandItem
                                            key={itemId}
                                            value={renderLabel(item)}
                                            onSelect={() => {
                                                onChange(isSelected ? "" : itemId);
                                                setOpen(false);
                                            }}
                                        >
                                            <Check className={cn(
                                                "mr-2 h-4 w-4 shrink-0",
                                                isSelected ? "opacity-100" : "opacity-0"
                                            )} />
                                            {renderLabel(item)}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}