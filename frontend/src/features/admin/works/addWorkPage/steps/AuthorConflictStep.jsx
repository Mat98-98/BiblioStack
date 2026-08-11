import { useState } from "react"
import { User, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button.jsx"
import { Badge } from "@/components/ui/badge.jsx"

function CandidateButton({ candidate, selected, onSelect }) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-colors w-full ${
                selected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-secondary/50"
            }`}
        >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-4 w-4 text-primary" />
            </div>

            <div className="flex flex-col gap-0.5 min-w-0">
                <span className="font-medium text-sm">
                    {candidate.firstName} {candidate.lastName}
                </span>

                {candidate.candidateWorks?.length > 0 && (
                    <span className="text-xs text-muted-foreground truncate">
                        {candidate.candidateWorks.slice(0, 3).join(", ")}
                    </span>
                )}
            </div>
        </button>
    )
}

function CreateNewButton({ inputName, selected, onSelect }) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors w-full ${
                selected
                    ? "border-primary bg-primary/5"
                    : "border-dashed border-border hover:border-primary/50 hover:bg-secondary/50"
            }`}
        >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <Plus className="h-4 w-4 text-muted-foreground" />
            </div>

            <span className="text-sm font-medium">
                Crea nuovo autore "{inputName}"
            </span>
        </button>
    )
}

function ConflictCard({ conflict, resolution, onResolve }) {
    const hasCandidates = conflict.candidates?.length > 0

    return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{conflict.inputName}</span>

                <Badge
                    variant="outline"
                    className={
                        hasCandidates
                            ? "text-orange-500 border-orange-500"
                            : "text-blue-500 border-blue-500"
                    }
                >
                    {hasCandidates ? "Conflitto" : "Nuovo autore"}
                </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
                {hasCandidates
                    ? "Trovati autori simili nel database. Seleziona quale usare o crea un nuovo autore."
                    : "Questo autore non esiste nel database. Conferma se vuoi crearlo."
                }
            </p>

            <div className="flex flex-col gap-2">
                {hasCandidates &&
                    conflict.candidates.map(candidate => (
                        <CandidateButton
                            key={candidate.id}
                            candidate={candidate}
                            selected={resolution?.authorId === candidate.id}
                            onSelect={() => onResolve(conflict.inputName, candidate.id)}
                        />
                    ))}

                <CreateNewButton
                    inputName={conflict.inputName}
                    selected={resolution?.authorId === null}
                    onSelect={() => onResolve(conflict.inputName, null)}
                />
            </div>
        </div>
    )
}

export default function AuthorConflictStep({
                                               conflicts,
                                               onResolve,
                                               onBack,
                                               loading
                                           }) {
    const [resolutions, setResolutions] = useState(() => {
        const initial = new Map()

        conflicts.forEach(c => {
            if (c.suggestedMatch !== null) {
                initial.set(c.inputName, {
                    inputName: c.inputName,
                    authorId: c.suggestedMatch
                })
            }
        })

        return initial
    })

    const handleResolve = (inputName, authorId) => {
        setResolutions(prev =>
            new Map(prev).set(inputName, { inputName, authorId })
        )
    }

    const allResolved = conflicts.every(
        c => resolutions.get(c.inputName)?.authorId !== undefined
    )

    const handleSubmit = () => {
        const payload = Array.from(resolutions.values())
        onResolve(payload)
    }

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-lg font-semibold">
                    Risolvi conflitti autori
                </h2>

                <p className="text-sm text-muted-foreground">
                    Per {conflicts.length}{" "}
                    {conflicts.length === 1 ? "autore" : "autori"} sono stati
                    trovati conflitti o possibili duplicati.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                {conflicts.map(conflict => (
                    <ConflictCard
                        key={conflict.inputName}
                        conflict={conflict}
                        resolution={resolutions.get(conflict.inputName)}
                        onResolve={handleResolve}
                    />
                ))}
            </div>

            <div className="flex gap-3">
                <Button
                    variant="outline"
                    onClick={onBack}
                    disabled={loading}
                >
                    Torna al form
                </Button>

                <Button
                    className="flex-1"
                    onClick={handleSubmit}
                    disabled={!allResolved || loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvataggio...
                        </>
                    ) : (
                        "Conferma e salva"
                    )}
                </Button>
            </div>
        </div>
    )
}