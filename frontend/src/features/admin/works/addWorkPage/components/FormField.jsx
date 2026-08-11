import { Label } from "@/components/ui/label.jsx"

function FieldError({ message }) {
    if (!message) return null
    return <p className="text-xs text-destructive mt-1">{message}</p>
}

export default function FormField({ label, error, children }) {
    return (
        <div className="space-y-1.5">
            <Label>{label}</Label>
            {children}
            <FieldError message={error} />
        </div>
    )
}