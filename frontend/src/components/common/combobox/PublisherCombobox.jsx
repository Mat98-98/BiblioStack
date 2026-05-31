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
import { usePublishers } from "@/hooks/usePublishers.js";

export default function PublisherCombobox({ value, onChange }) {
    const [open, setOpen]         = useState(false)
    const { publishers, loading } = usePublishers()

    const selected = publishers.find(p => p.id === Number(value))

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
                        ? <span className="truncate">{selected.name}</span>
                        : <span className="text-muted-foreground">Seleziona editore...</span>
                    }
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Cerca editore..." />
                    <CommandList>
                        {loading && (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        )}
                        {!loading && publishers.length === 0 && (
                            <CommandEmpty>Nessun risultato.</CommandEmpty>
                        )}
                        {!loading && (
                            <CommandGroup>
                                {publishers.map(p => (
                                    <CommandItem
                                        key={p.id}
                                        value={p.name}
                                        onSelect={() => {
                                            onChange(p.id === Number(value) ? "" : String(p.id))
                                            setOpen(false)
                                        }}
                                    >
                                        <Check className={cn(
                                            "mr-2 h-4 w-4 shrink-0",
                                            Number(value) === p.id ? "opacity-100" : "opacity-0"
                                        )} />
                                        <span className="text-sm">{p.name}</span>
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