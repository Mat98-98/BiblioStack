import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { useEditUser } from "@/features/admin/users/dialogs/editUserDialog/useEditUser.js";

export default function EditUserDialog({ user, open, onClose, onConfirm }) {
    const { form, loading, setLoading } = useEditUser(user, open)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = form

    const onSubmit = handleSubmit(async (data) => {
        if (!user) return

        setLoading(true)

        try {
            await onConfirm(user.id, {
                ...data,
                phone: data.phone || null
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
                        Modifica {user?.firstName} {user?.lastName}
                    </DialogTitle>

                    <DialogDescription>
                        Modifica i dati anagrafici dell'utente
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Nome</Label>

                            <Input {...register("firstName")} />

                            {errors.firstName && (
                                <p className="text-xs text-destructive">
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label>Cognome</Label>

                            <Input {...register("lastName")} />

                            {errors.lastName && (
                                <p className="text-xs text-destructive">
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Email</Label>

                        <Input
                            type="email"
                            {...register("email")}
                        />

                        {errors.email && (
                            <p className="text-xs text-destructive">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label>Telefono</Label>

                        <Input
                            type="tel"
                            placeholder="Opzionale"
                            {...register("phone")}
                        />

                        {errors.phone && (
                            <p className="text-xs text-destructive">
                                {errors.phone.message}
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
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Salvataggio...
                                </>
                            ) : (
                                "Salva modifiche"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}