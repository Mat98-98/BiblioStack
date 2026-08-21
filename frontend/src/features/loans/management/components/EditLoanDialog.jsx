import { useEditLoan } from "@/features/loans/management/hooks/useEditLoan.js";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.jsx";


export default function EditLoanDialog({ loan, open, onClose, onConfirm }) {
    const { form, loading, submit } = useEditLoan(loan, open, () => {
        onConfirm?.();
        onClose();
    });
    const { register, handleSubmit, formState: { errors } } = form;

    if (!loan) return null;

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifica prestito</DialogTitle>
                    <DialogDescription>
                        Copia <span className="font-mono">{loan.item.id}</span>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="dueDate">Data di scadenza</Label>
                        <Input id="dueDate" type="date" {...register("dueDate")} />
                        {errors.dueDate && <span className="text-xs text-destructive">{errors.dueDate.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="returnDate">Data restituzione</Label>
                        <Input id="returnDate" type="date" {...register("returnDate")} />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Annulla</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Salvataggio..." : "Salva"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}