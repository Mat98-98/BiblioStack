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
import { useDeweyCodes } from "@/features/works/hooks/useDeweyCodes.js";

export default function DeweyCombobox({ value, onChange }) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const { codes, loading } = useDeweyCodes(search)

    const selected = codes.find(d => d.code === value)

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
                        ? <span className="truncate">{selected.code} — {selected.description}</span>
                        : <span className="text-muted-foreground">Seleziona codice Dewey...</span>
                    }
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command shouldFilter={true}>
                    <CommandInput
                        placeholder="Cerca codice o descrizione..."
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        {loading && (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        )}

                        {!loading && codes.length === 0 && (
                            <CommandEmpty>Nessun risultato.</CommandEmpty>
                        )}

                        {!loading && codes.length > 0 && (
                            <CommandGroup>
                                {codes.map(d => (
                                    <CommandItem
                                        key={d.code}
                                        value={`${d.code} ${d.description}`}
                                        onSelect={() => {
                                            onChange(d.code === value ? "" : d.code)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check className={cn(
                                            "mr-2 h-4 w-4 shrink-0",
                                            value === d.code ? "opacity-100" : "opacity-0"
                                        )} />
                                        <span className="font-mono text-sm mr-2">{d.code}</span>
                                        <span className="text-muted-foreground text-sm truncate">{d.description}</span>
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