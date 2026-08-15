import { useState } from "react";
import { Search, Loader2, ScanBarcode } from "lucide-react";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import CodeScannerDialog from "@/features/qrCode/CodeScannerDialog.jsx";

export default function WorkIsbnSearch({ onSearch, loading }) {
    const [isbn, setIsbn] = useState("");
    const [scannerOpen, setScannerOpen] = useState(false);

    const handleSearch = () => onSearch(isbn);

    const handleScan = (scannedIsbn) => {
        setIsbn(scannedIsbn); // Riempie il campo isbn con il barcode
        onSearch(scannedIsbn); // Lancia cerca in automatico dopo la scansione
    };
    return (
        <div className="flex gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    className="pl-10"
                    placeholder="Cerca per ISBN (es. 9788818039283)"
                    value={isbn}
                    onChange={e => setIsbn(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSearch()}
                    disabled={loading}
                />
            </div>

            <Button
                type={"button"}
                variant={"outline"}
                size={"icon"}
                onClick={() => setScannerOpen(true)}
                disabled={loading}
                title={"Scansiona il codice a barre"}
            >
                <ScanBarcode className="h-4 w-4"/>
            </Button>
            <Button onClick={handleSearch} disabled={loading || !isbn.trim()}>
                {loading
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : "Cerca"
                }
            </Button>


            <CodeScannerDialog
                open={scannerOpen}
                onClose={() => setScannerOpen(false)}
                onScan={handleScan}
                type={"barcode"}
                title={"Scansiona il codice a barre"}
                description={"Inquadra il codice a barre"}
            />
        </div>
    )
}