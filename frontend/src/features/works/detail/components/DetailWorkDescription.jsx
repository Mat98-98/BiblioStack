import { useState } from "react";

export default function DetailWorkDescription({ description }) {
    const [expanded, setExpanded] = useState(false);
    const MAX_LENGTH = 300;
    const isLong = description?.length > MAX_LENGTH;
    const displayedText = expanded || !isLong ? description : description.slice(0, MAX_LENGTH) + "...";

    if (!description) return null;

    return (
        <div className="w-full border-t pt-12">
            <h2 className="text-xl font-semibold text-muted-foreground mb-2">Descrizione</h2>
            <p className="text-sm leading-relaxed text-foreground pt-4">{displayedText}</p>
            {isLong && (
                <button
                    onClick={() => setExpanded(v => !v)}
                    className="mt-2 text-sm font-medium text-primary hover:underline"
                >
                    {expanded ? "Mostra meno" : "Leggi di più"}
                </button>
            )}
        </div>
    );
}