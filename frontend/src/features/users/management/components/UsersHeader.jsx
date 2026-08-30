import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button.jsx"

export default function UsersHeader({ onCreateClick }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold">Utenti</h1>
                <p className="text-sm text-muted-foreground">
                    Gestisci gli utenti della biblioteca
                </p>
            </div>
            <Button onClick={onCreateClick}>
                <Plus className="h-4 w-4" />
                Nuovo utente
            </Button>
        </div>
    )
}