import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible.jsx";
import { ChevronDown } from "lucide-react";


export default function DetailWorkDescription({ description }) {
    const [expanded, setExpanded] = useState(false);
    const MAX_LENGTH = 300;
    const isLong = description?.length > MAX_LENGTH;

    if (!description) return null;

    return (
        <div className="w-full border-t pt-12">
            <h2 className="text-xl font-semibold text-muted-foreground mb-2">Descrizione</h2>
            <Collapsible open={!isLong || expanded} onOpenChange={setExpanded}>
                <CollapsibleContent
                    forceMount
                    className={!isLong ? "" : "relative overflow-hidden data-[state=closed]:max-h-24 transition[max-height] duration-300"}
                    >
                    <p className="text-sm leading-relaxed text-foreground pt-4">{description}</p>
                    {isLong && !expanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-background to-transparent pointer-events-none" />
                        )}
                </CollapsibleContent>
                <CollapsibleTrigger className={"mt-2 flex items-center gap-1 text-sm font-medium text-primary hover:underline"}>
                    {expanded ? "Mostra meno" : "Leggi di più"}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
            </Collapsible>
        </div>
    );
}