import CardView from "@/features/qrCode/CardView.jsx";

export default function CardPage() {
    return (
        <main className="container max-w-md mx-auto py-12 px-4 space-y-6">
            <div className="space-y-1 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">La mia tessera</h1>
                <p className="text-sm text-muted-foreground">
                    Usa il QR code per accedere ai servizi della biblioteca
                </p>
            </div>

            <div className="flex justify-center pt-4">
                <CardView />
            </div>
        </main>
    );
}