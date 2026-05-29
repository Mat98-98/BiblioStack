import { useState } from "react"
import { useAuth } from "@/context/AuthContext.jsx"
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
import { Textarea } from "@/components/ui/textarea.jsx"
import { Loader2 } from "lucide-react"

export default function UpdateWorkDialog({work, open, onClose, onConfirm }) {
    const { user: admin } = useAuth()
    const [title, setTitle]   = useState("")
    const [loading, setLoading] = useState(false)


    const handleConfirm = async () => {
        setLoading(true)
        try {
            await onConfirm({
                workId:    work.id,
                publisherId: publisherId,
                deweyCode:    deweyCode ,
                endDate:   endDate || undefined,
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
                        Modifica {work?.title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label>Motivo</Label>
                        <Textarea
                            placeholder="Motivo della sospensione (opzionale)"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            rows={3}
                            className="resize-none"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Data fine sospensione</Label>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                        />
                        <p className="text-xs text-muted-foreground">
                            Lascia vuoto per sospensione a tempo indeterminato
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Annulla
                    </Button>
                    <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
                        {loading
                            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Modifica dei dati...</>
                            : "Modifica opera"
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}