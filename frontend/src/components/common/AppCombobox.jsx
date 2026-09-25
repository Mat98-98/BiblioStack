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
                                        className = "",

                                        // --- Nuove prop, tutte opzionali: attivano la modalità "async" ---
                                        onOpen,                     // Chiamata alla prima apertura del popover (lazy load)
                                        onSearch,                   // Se presente, la ricerca è delegata al server invece che al filtro locale di cmdk
                                        onLoadMore,                 // Chiamata quando si scrolla vicino al fondo della lista
                                        hasMore = false,             // Se true, abilita lo scroll infinito verso onLoadMore
                                    }) {
    const [open, setOpen] = useState(false);
    const isAsync = typeof onSearch === "function";

    // Trova l'elemento attualmente selezionato
    const selectedItem = items.find(item => getOptionValue(item) === value);

    const handleScroll = (event) => {
        if (!onLoadMore) return;
        const el = event.currentTarget;
        const isNearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
        if (isNearBottom && hasMore && !loading) onLoadMore();
    };

    return (
        <Popover
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (isOpen) onOpen?.();
            }}
        >
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
                {/* shouldFilter disattivato in modalità async: il filtro lo fa il server, non cmdk in locale */}
                <Command shouldFilter={!isAsync}>
                    <CommandInput
                        placeholder={searchPlaceholder}
                        {...(isAsync && { onValueChange: onSearch })}
                    />
                    <CommandList onScroll={isAsync ? handleScroll : undefined}>
                        {loading && items.length === 0 && (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        )}

                        {!loading && items.length === 0 && (
                            <CommandEmpty>Nessun risultato.</CommandEmpty>
                        )}

                        {items.length > 0 && (
                            <CommandGroup>
                                {items.map(item => {
                                    const itemId = getOptionValue(item);
                                    const isSelected = itemId === value;

                                    return (
                                        <CommandItem
                                            key={itemId}
                                            value={renderLabel(item)}
                                            className="cursor-pointer"
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

                        {isAsync && loading && items.length > 0 && (
                            <div className="flex items-center justify-center py-2">
                                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                            </div>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}