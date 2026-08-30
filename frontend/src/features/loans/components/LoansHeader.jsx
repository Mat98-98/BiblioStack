import { useState } from "react";
import { CheckCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import AddLoanDialog from "@/features/loans/management/components/AddLoanDialog.jsx";
import CheckInDialog from "@/features/loans/management/components/CheckInDialog.jsx";

export default function LoansHeader({ onLoanAdded, onNotify }) {
    const [addOpen, setAddOpen] = useState(false);
    const [quickCheckInOpen, setQuickCheckInOpen] = useState(false);

    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">Prestiti</h1>
                <p className="text-sm text-muted-foreground">
                    Elenco dei prestiti registrati
                </p>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setQuickCheckInOpen(true)} className="gap-2">
                    <CheckCircle className="h-4 w-4"/>
                    Riconsegna
                </Button>

            <Button variant="default" onClick={() => setAddOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Esegui prestito
            </Button>
            </div>

            <AddLoanDialog
                open={addOpen}
                onClose={() => { setAddOpen(false); onLoanAdded?.(); }}
            />

            <CheckInDialog
                open={quickCheckInOpen}
                onClose={() =>  setQuickCheckInOpen(false)}
                onSuccess={onLoanAdded}
                onNotify={onNotify}
            />
        </div>
    );
}