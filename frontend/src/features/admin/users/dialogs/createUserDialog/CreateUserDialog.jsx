import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
import { useCreateUser } from "@/features/admin/users/dialogs/createUserDialog/useCreateUser.js";



function FieldError({ message }) {
    if (!message) return null;
    return <p className="text-xs text-destructive mt-1">{message}</p>;
}

export default function CreateUserDialog({ open, onClose, onConfirm }) {
    const { form, loading, setLoading } = useCreateUser();
    const { register, handleSubmit, control, reset, formState: { errors } } = form
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true)
        try {
            await onConfirm({
                ...data,
                phone:  data.phone  || null
            })
            reset();
            onClose();
        } finally {
            setLoading(false);
        }
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">

                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="text-xl">
                        Crea nuovo utente
                    </DialogTitle>

                    <DialogDescription className="text-sm text-muted-foreground">
                        Inserisci le informazioni del nuovo utente della biblioteca.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="px-6 pb-6 pt-4 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div className="space-y-2">
                            <Label>Nome *</Label>
                            <Input {...register("firstName")} />
                            <FieldError message={errors.firstName?.message} />
                        </div>

                        <div className="space-y-2">
                            <Label>Cognome *</Label>
                            <Input {...register("lastName")} />
                            <FieldError message={errors.lastName?.message} />
                        </div>

                    </div>

                    <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input type="email" {...register("email")} />
                        <FieldError message={errors.email?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label>Telefono</Label>
                        <Input
                            type="tel"
                            {...register("phone")}
                            placeholder="Opzionale"
                        />
                        <FieldError message={errors.phone?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label>Password *</Label>

                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                className="pr-10"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword
                                    ? <EyeOff className="h-4 w-4" />
                                    : <Eye className="h-4 w-4" />
                                }
                            </button>
                        </div>

                        <FieldError message={errors.password?.message} />
                    </div>

                    <DialogFooter className="pt-4 gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Annulla
                        </Button>

                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creazione...
                                </>
                            ) : (
                                "Crea utente"
                            )}
                        </Button>
                    </DialogFooter>

                </form>

            </DialogContent>
        </Dialog>
    )
}