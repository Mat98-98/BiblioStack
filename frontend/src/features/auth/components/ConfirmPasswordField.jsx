import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";

export default function ConfirmPasswordField({ value, onChange }) {
    const [show, setShow] = useState(false);

    return (
        <div className="space-y-2">
            <Label>Conferma password</Label>

            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input
                    className="pl-10 pr-10"
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                />

                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
        </div>
    );
}