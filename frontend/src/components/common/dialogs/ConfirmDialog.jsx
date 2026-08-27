import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";

export function ConfirmDialogContent({
                                          onClose,
                                          onConfirm,
                                          title,
                                          description,
                                          confirmLabel = "Conferma",
                                          cancelLabel = "Annulla",
                                          variant = "default",
                                          closeOnConfirm = true, // Se false, evita la chiusura automatica al click su conferma. Di default chiude al click su conferma
                                          children
                                      }) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
            // Chiude il dialog solo se esplicitamente richiesto
            if (closeOnConfirm) {
                onClose();
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DialogHeader className="space-y-0.5">
                <DialogTitle className="text-xl">{title}</DialogTitle>
                {description && (
                    <DialogDescription>{description}</DialogDescription>
                )}
            </DialogHeader>

            {children}

            <DialogFooter className="gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                >
                    {cancelLabel}
                </Button>

                <Button
                    type="button"
                    variant={variant}
                    onClick={handleConfirm}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {confirmLabel}...
                        </>
                    ) : (
                        confirmLabel
                    )}
                </Button>
            </DialogFooter>
        </>
    );
}

// Uso standalone: apre il proprio <Dialog>
export default function ConfirmDialog({ open, onClose, ...props }) {
    return (
        <Dialog open={open} onOpenChange={onclose}>
            <DialogContent className="sm:max-w-md">
                <ConfirmDialogContent onClose={onClose} {...props} />
            </DialogContent>
        </Dialog>
    );
}