import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Input } from "@/components/ui/input.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Label } from "@/components/ui/label.jsx"

export default function AuthorsField({ value, onChange, error }) {
    const [newAuthor, setNewAuthor] = useState("")

    const add = () => {
        const trimmed = newAuthor.trim()
        if (!trimmed || value.includes(trimmed)) return
        onChange([...value, trimmed])
        setNewAuthor("")
    }

    const remove = (name) => onChange(value.filter(a => a !== name))

    return (
        <div className="space-y-1.5">
            <Label>Autori *</Label>

            <div className="flex gap-2">
                <Input
                    placeholder="Nome Cognome"
                    value={newAuthor}
                    onChange={e => setNewAuthor(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
                />
                <Button type="button" variant="outline" size="icon" onClick={add}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            {value.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {value.map(a => (
                        <Badge key={a} variant="secondary" className="gap-1 pr-1">
                            {a}
                            <button
                                type="button"
                                onClick={() => remove(a)}
                                className="ml-1 hover:text-destructive"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
    )
}