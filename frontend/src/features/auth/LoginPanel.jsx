import { useState } from "react";

import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Separator } from "@/components/ui/separator.jsx";

import { notify } from "@/lib/notify.js";
import { useLogin } from "@/features/auth/useLogin.js";



export default function LoginPanel({ onGoogleLogin }) {

    const {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        login
    } = useLogin();

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita refresh del form
        await login();
    }

    const handleGoogle = () => {
        if (onGoogleLogin) return onGoogleLogin();
        notify.info("Google login non ancora implementato");
    }

    return (
        <div className="w-full max-w-md space-y-6">

            {/* HEADER */}
            <div className="text-center space-y-1">
                <h2 className="text-2xl font-semibold">Bentornato</h2>
                <p className="text-sm text-muted-foreground">
                    Accedi al tuo account
                </p>
            </div>

            {/* LOGIN GOOGLE */}
            <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogle}
                type="button"
            >
                <FcGoogle className="h-5 w-5" />
                Continua con Google
            </Button>

            {/* SEPARATORE */}
            <div className="flex items-center gap-6">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">oppure</span>
                <Separator className="flex-1" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* EMAIL */}
                <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-10"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                {/* PASSWORD */}
                <div className="space-y-2">
                    <Label>Password</Label>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                        <Input
                            className="pl-10 pr-10"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {/* TOGGLE VISIBILITÀ PASSWORD */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {/* BOTTONE SUBMIT LOGIN */}
                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? "Accesso..." : (
                        <>
                            Accedi
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>

            </form>
        </div>
    )
}