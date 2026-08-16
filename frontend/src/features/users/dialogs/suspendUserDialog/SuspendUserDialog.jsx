import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog.jsx";

import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";

import { useAuth } from "@/context/AuthContext.jsx";
import { useSuspendUser } from "@/features/users/dialogs/suspendUserDialog/useSuspendUser.js";


export default function SuspendUserDialog({ user, open, onClose, onConfirm }) {
    const { user: admin } = useAuth()
    const { form, loading, setLoading } = useSuspendUser(user, admin)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = form

    const onSubmit = handleSubmit(async (data) => {
        if (!user || !admin) return

        setLoading(true)

        try {
            await onConfirm({
                userId: user.id,
                handledBy: admin.id,
                ...(data.reason ? { reason: data.reason } : {}),
                ...(data.endDate ? { endDate: data.endDate } : {}),
            })

            onClose()
        } finally {
            setLoading(false)
        }
    })

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Sospendi {user?.firstName} {user?.lastName}
                    </DialogTitle>

                    <DialogDescription>
                        L'utente non potrà accedere fino alla riattivazione
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label>Motivo</Label>

                        <Textarea
                            placeholder="Motivo della sospensione (opzionale)"
                            rows={3}
                            className="resize-none"
                            {...register("reason")}
                        />

                        {errors.reason && (
                            <p className="text-xs text-destructive">
                                {errors.reason.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label>Data fine sospensione</Label>

                        <Input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            {...register("endDate")}
                        />

                        <p className="text-xs text-muted-foreground">
                            Lascia vuoto per sospensione a tempo indeterminato
                        </p>

                        {errors.endDate && (
                            <p className="text-xs text-destructive">
                                {errors.endDate.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Annulla
                        </Button>

                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sospensione...
                                </>
                            ) : (
                                "Sospendi utente"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}