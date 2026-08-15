import { useState } from "react";
import { QrCode } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog.jsx";
import CardView from "@/features/qrCode/CardView.jsx";


export default function CardDialog({ children }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {/* Se gli passiamo dei children (es. la voce del menu), usa quelli, altrimenti renderizza un pulsante di default */}
                {children ?? (
                    <button className="flex items-center gap-2 w-full">
                        <QrCode className="mr-2 h-4 w-4" />
                        La mia tessera
                    </button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm flex flex-col items-center text-center">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-xl">La mia tessera</DialogTitle>
                    <DialogDescription>
                        Usa il QR code per identificarti o ritirare i tuoi prestiti
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 w-full flex justify-center">
                    <CardView />
                </div>
            </DialogContent>
        </Dialog>
    );
}