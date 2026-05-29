import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Label } from "@/components/ui/label.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Loader2 } from "lucide-react"
import api from "@/api/axios.js";

export default function EditUserDialog({ user, open, onClose, onConfirm }) {
    const [form, setForm] = useState({
        firstName: "",
        lastName:  "",
        email:     "",
        phone:     "",
    })
    const [loading, setLoading] = useState(false)

    // Sincronizza i campi quando cambia l'utente
    useEffect(() => {
        if (!open || !user?.id) return

        api.get(`/users/${user.id}`)
            .then(r => setForm({
                firstName: r.data.firstName ?? "",
                lastName:  r.data.lastName  ?? "",
                email:     r.data.email     ?? "",
                phone:     r.data.phone     ?? "",
            }))
            .catch(() => {})
    }, [open, user?.id])

    const field = (name) => ({
        value:    form[name],
        onChange: (e) => setForm(prev => ({ ...prev, [name]: e.target.value })),
    })

    const handleConfirm = async () => {
        setLoading(true)
        try {
            await onConfirm(user.id, {
                firstName: form.firstName || undefined,
                lastName:  form.lastName  || undefined,
                email:     form.email     || undefined,
                phone:     form.phone     || null,
            })
            onClose()
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Modifica {user?.firstName} {user?.lastName}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Nome</Label>
                            <Input {...field("firstName")} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Cognome</Label>
                            <Input {...field("lastName")} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Email</Label>
                        <Input type="email" {...field("email")} />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Telefono</Label>
                        <Input type="tel" {...field("phone")} placeholder="Opzionale" />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Annulla
                    </Button>
                    <Button onClick={handleConfirm} disabled={loading}>
                        {loading
                            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvataggio...</>
                            : "Salva modifiche"
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}