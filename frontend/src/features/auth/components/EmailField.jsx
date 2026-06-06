import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";

export default function EmailField({ value, onChange }) {
    return (
        <div className="space-y-2">
            <Label>Email</Label>

            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input
                    className="pl-10"
                    type="email"
                    value={value}
                    onChange={onChange}
                />
            </div>
        </div>
    )
}