import { Mail, Phone, Shield, LucideWrench } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Button } from "@/components/ui/button.jsx"

export default function ProfileHero({ user }) {
    const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`

    const roleLabel = {
        admin: "Amministratore",
        librarian: "Bibliotecario",
        student: "Studente",
    }[user.role?.name] ?? user.role?.name

    return (
        <div className="rounded-3xl border border-border bg-card px-10 py-10 shadow-sm">

            <div className="flex flex-col items-center text-center gap-6">

                {/* Avatar */}
                <div className="relative">
                    <Avatar className="h-24 w-24 rounded-3xl">
                        <AvatarFallback className="rounded-3xl bg-primary/10 text-primary text-2xl font-semibold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    <Badge
                        variant="secondary"
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1"
                    >
                        <Shield className="h-3 w-3" />
                        {roleLabel}
                    </Badge>
                </div>

                {/* Name */}
                <div className="space-y-1">
                    <h1 className="text-3xl font-semibold tracking-tight select-none">
                        {user.firstName} {user.lastName}
                    </h1>
                </div>

                {/* Info row */}
                <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
                    {user.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{user.phone}</span>
                        </div>
                    )}
                    {user.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{user.email}</span>
                        </div>
                    )}
                </div>

                {/* Action */}
                <div className="pt-2">
                    <Button variant="outline" size="sm" className="rounded-full px-6 gap-2">
                        <LucideWrench className="h-4 w-4" />
                        Cambia password
                    </Button>
                </div>

            </div>
        </div>
    )
}

/*
import { Mail, Phone, Shield, LucideWrench } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import {Button} from "@/components/ui/button.jsx";

export default function ProfileHero({ user }) {
    const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`

    const roleLabel = {
        admin: "Amministratore",
        librarian: "Bibliotecario",
        student: "Studente",
    }[user.role?.name] ?? user.role?.name

    return (
        <div className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center sm:items-start gap-8">

            <Avatar className="h-20 w-20 rounded-2xl shrink=0">
                <AvatarFallback className="rounded-2xl bg-primary/10 text-primary text-2xl font-bold">
                    {initials}
                </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-3 text-center sm:text-left w-full">

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h1 className="text-2xl font-bold select-none cursor-default">
                        {user.firstName} {user.lastName}
                    </h1>
                    <Badge variant="secondary" className="self-center sm:self-auto gap-1 select-none cursor-default">
                        <Shield className="h-3 w-3" />
                        {roleLabel}
                    </Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center justify-center sm:justify-start gap-1.5 select-none cursor-default">
                        <Mail className="h-4 w-4 shrink-0" />
                        {user.email}
                    </span>

                    {user.phone && (
                        <span className="flex items-center justify-center sm:justify-start gap-2 select-none cursor-default">
                            <Phone className="h-4 w-4 shrink-0" />
                            {user.phone}
                        </span>
                    )}
                </div>

                <div className="flex pl-1 pt-2">
                    <Button variant="outline" size="sm">
                        <LucideWrench className="h-4 w-4 shrink-0" />
                        Cambia password
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 text-sm text-muted-foreground">

                </div>

            </div>
        </div>
    )
}
*/