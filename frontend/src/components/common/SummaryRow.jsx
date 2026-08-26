export function SummaryRow({ icon: Icon, label, value }) {
    if (!value) return null;
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <Icon className="h-4 w-4 text-muted-foreground"/>
            </div>
            <div className="flex flex-col gap-0.5 flex-1">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-sm font-medium">{value}</span>
            </div>
        </div>
    );
}