import { Search } from "lucide-react"
import { Input } from "@/components/ui/input.jsx"

export default function SearchBar({ value, onChange, placeholder = "Cerca..." }) {
    return (
        <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                className="pl-10"
                placeholder={placeholder}
                defaultValue={value}
                onKeyDown={e => { if (e.key === "Enter") onChange(e.target.value) }}
                onBlur={e => onChange(e.target.value)}
            />
        </div>
    )
}