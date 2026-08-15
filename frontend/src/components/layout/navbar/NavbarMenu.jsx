import { Link } from "react-router-dom"
import {User, BookMarked, Settings, LogOut, Menu, LayoutDashboard, QrCode} from "lucide-react"
import { useAuth } from "@/context/AuthContext.jsx"

import { Button } from "@/components/ui/button.jsx"
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet.jsx"
import CardDialog from "@/features/qrCode/CardDialog.jsx";

// ─── shared ──────────────────────────────────────────────────────────────────

function useUserMenu() {
    const { user, logout } = useAuth()
    const initials = user
        ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`
        : "?"
    return { user, logout, initials }
}

const menuLinks = [
    { to: "/profile",  icon: User,       label: "Profilo"      },
    { to: "/loans",    icon: BookMarked, label: "Prestiti"     },
    { to: "/settings", icon: Settings,   label: "Impostazioni" },
]

// Desktop

export function DesktopMenu() {
    const { user, logout, initials } = useUserMenu()


    return (
        <div className="hidden sm:block">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0">
                        <Avatar>
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                    <div className="p-2 font-medium select-none cursor-default">
                        Ciao
                    </div>

                    <DropdownMenuSeparator />

                    {menuLinks.map(({ to, icon: Icon, label }) => (
                        <DropdownMenuItem key={to} asChild>
                            <Link to={to} className="cursor-pointer">
                                <Icon className="mr-2 h-4 w-4" />
                                {label}
                            </Link>
                        </DropdownMenuItem>
                    ))}

                    <CardDialog>
                        <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                            <div className="cursor-pointer flex items-center w-full">
                                <QrCode className="mr-2 h-4 w-4" />
                                <span>La mia tessera</span>
                            </div>
                        </DropdownMenuItem>
                    </CardDialog>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

// Mobile

export function MobileMenu() {
    const { user, logout, initials } = useUserMenu()

    return (
        <div className="sm:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10">
                        <Menu className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-70 p-0">
                    <SheetHeader className="p-5 border-b border-border bg-secondary/30">
                        <SheetTitle className="flex items-center gap-4">
                            <Avatar className="h-14 w-14 rounded-2xl">
                                <AvatarFallback className="bg-linear-to-br from-primary/20 to-accent/20 text-foreground font-bold rounded-2xl text-lg">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start">
                                <span className="text-lg font-bold select-none cursor-default">
                                    Ciao
                                </span>
                                <span className="text-sm text-muted-foreground font-normal select-none cursor-default">
                                    Stude
                                </span>
                            </div>
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex flex-col p-3 gap-1">
                        {menuLinks.map(({ to, icon: Icon, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className="flex items-center gap-3 px-4 py-3.5 text-foreground hover:bg-secondary rounded-xl transition-colors active:bg-secondary/80"
                            >
                                <Icon className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">{label}</span>
                            </Link>
                        ))}

                        <CardDialog>
                            <button className="flex items-center gap-3 px-4 py-3.5 text-foreground hover:bg-secondary rounded-xl transition-colors w-full text-left">
                                <QrCode className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">La mia tessera</span>
                            </button>
                        </CardDialog>


                        <div className="my-2 border-t border-border" />

                        <button
                            onClick={logout}
                            className="flex items-center gap-3 px-4 py-3.5 text-destructive hover:bg-destructive/10 rounded-xl transition-colors active:bg-destructive/20"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}