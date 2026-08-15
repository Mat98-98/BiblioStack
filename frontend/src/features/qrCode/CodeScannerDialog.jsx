import { useEffect, useRef} from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog.jsx";


const FORMATS_MAP = {
    qr: ["qr_code"],
    barcode: ["ean_13", "ean_8", "code_128", "upc_a", "upc_e"]
};

export default function CodeScannerDialog({
    open,
    onClose,
    onScan,
    type = "qr",
    title = type === "qr" ? "Scansiona il QR code" : "Scansiona il codice a barre",
    description = type === "qr" ? "Inquadra il codice QR con la fotocamera" : "Inquadra il codice a barre con la fotocamera",
    formats: customFormats
}) {

    // Evita chiamate multiple a onScan
    const hasScannedRef = useRef(false);

    useEffect(() => {
        // Reset a ogni riapertura dialog
        if (open) hasScannedRef.current = false;
    }, [open]);


    const handleScan = (detectedCodes) => {

        if (hasScannedRef.current) return;

        const raw = detectedCodes[0]?.rawValue;
        if (!raw) return;

        hasScannedRef.current = true;
        onScan(raw);
        onClose();
    };

    const formats = customFormats || FORMATS_MAP[type] || FORMATS_MAP.qr;


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md flex flex-col items-center">
                <DialogHeader className="space-y-2 text-center">
                    <DialogTitle className="text-xl">{title}</DialogTitle>
                    {description && (
                        <DialogDescription>{description}</DialogDescription>
                    )}
                </DialogHeader>

                <div className="w-full rounded-2xl overflow-hidden border border-border mt-2">
                    {open && (
                        <Scanner onScan={handleScan} formats={formats} />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}