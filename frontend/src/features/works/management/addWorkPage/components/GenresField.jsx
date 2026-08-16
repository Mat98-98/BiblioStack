import { Label } from "@/components/ui/label.jsx"

export default function GenresField({ value, onChange, genres }) {
    const toggle = (id) => {
        onChange(value.includes(id)
            ? value.filter(g => g !== id)
            : [...value, id]
        )
    }

    return (
        <div className="space-y-1.5">
            <Label>Generi</Label>
            <div className="flex flex-wrap gap-2">
                {genres.map(g => (
                    <button
                        key={g.id}
                        type="button"
                        onClick={() => toggle(g.id)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                            value.includes(g.id)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                    >
                        {g.name}
                    </button>
                ))}
            </div>
        </div>
    )
}