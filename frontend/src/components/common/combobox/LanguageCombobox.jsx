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
import { useLanguages } from "@/hooks/useLanguages.js";

export default function LanguageCombobox({ value, onChange }) {
    const [open, setOpen]       = useState(false)
    const { languages, loading } = useLanguages()

    const selected = languages.find(l => l.languageCode === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal"
                >
                    {selected
                        ? <span>{selected.name}</span>
                        : <span className="text-muted-foreground">Seleziona lingua...</span>
                    }
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Cerca lingua..." />
                    <CommandList>
                        {loading && (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        )}
                        {!loading && languages.length === 0 && (
                            <CommandEmpty>Nessun risultato.</CommandEmpty>
                        )}
                        {!loading && (
                            <CommandGroup>
                                {languages.map(l => (
                                    <CommandItem
                                        key={l.languageCode}
                                        value={`${l.languageCode} ${l.name}`}
                                        onSelect={() => {
                                            onChange(l.languageCode === value ? "" : l.languageCode)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check className={cn(
                                            "mr-2 h-4 w-4 shrink-0",
                                            value === l.languageCode ? "opacity-100" : "opacity-0"
                                        )} />
                                        <span className="text-sm">{l.name}</span>
                                        <span className="ml-auto text-xs text-muted-foreground">{l.languageCode}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}