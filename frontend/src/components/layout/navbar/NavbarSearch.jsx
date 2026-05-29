import { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input.jsx"
import { useNavigate } from "react-router-dom"

function SearchInput({ placeholder, className, autoFocus }) {
    const navigate = useNavigate()
    const [value, setValue] = useState("")

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            if (value.trim()) {
                navigate(`/catalog?search=${encodeURIComponent(value.trim())}`)
            } else {
                navigate("/catalog")
            }
        }
    }

    return (
        <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary" />
            <Input
                type="search"
                placeholder={placeholder}
                className={className}
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus={autoFocus}
            />
        </div>
    )
}

export function DesktopSearch() {
    return (
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <SearchInput
                placeholder="Cerca nella biblioteca..."
                className="w-full pl-11 h-11 bg-secondary/50 border-transparent rounded-2xl focus:border-primary/50 focus:bg-card focus:ring-2 focus:ring-primary/20 transition-all"
            />
        </div>
    )
}

export function MobileSearchBar({ open }) {
    if (!open) return null
    return (
        <div className="md:hidden absolute left-0 right-0 top-16 z-50 bg-background border-b px-4 py-3">
            <SearchInput
                placeholder="Cerca..."
                className="w-full pl-11 h-12 bg-secondary/50 border border-border rounded-2xl"
                autoFocus
            />
        </div>
    )
}

export function useMobileSearch() {
    const [open, setOpen] = useState(false)
    const toggle = () => setOpen(prev => !prev)
    return { open, toggle }
}