import { Button } from "@/components/ui/button.jsx";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function WorksHeader() {
return (
        <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold">Opere</h1>
                <p className="text-sm text-muted-foreground">
                    Gestisci le opere della biblioteca
                </p>
            </div>
            <Button asChild>
                <Link to="/admin/works/add" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Aggiungi opera
                </Link>
            </Button>
        </div>
    )
}