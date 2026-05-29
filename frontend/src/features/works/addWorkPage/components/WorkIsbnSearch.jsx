import { useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input.jsx"
import { Button } from "@/components/ui/button.jsx"

export default function WorkIsbnSearch({ onSearch, loading }) {
    const [isbn, setIsbn] = useState("")

    const handleSearch = () => onSearch(isbn)

    return (
        <div className="flex gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    className="pl-10"
                    placeholder="Cerca per ISBN (es. 9788884516107)"
                    value={isbn}
                    onChange={e => setIsbn(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSearch()}
                    disabled={loading}
                />
            </div>
            <Button onClick={handleSearch} disabled={loading || !isbn.trim()}>
                {loading
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : "Cerca"
                }
            </Button>
        </div>
    )
}