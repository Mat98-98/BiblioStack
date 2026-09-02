import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, QrCode } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet.jsx";
import CardDialog from "@/features/qrCode/CardDialog.jsx";


const menuLinks = [
    { to: "/profile", icon: User, label: "Profilo" }
];

/*
    Sheet a tutto schermo con i dati dell'utente (profilo, tessera, logout), pensata per mobile. Questo è il componente sostituto del dropdownMenu in UserAccountMenu.jsx
    Il parametro side è configurabile con ["top"|"right"|"bottom"|"left"]
 */

export default function UserAccountSheet({ trigger, side = "right" })  {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const initials = user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}` : "?";

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                {trigger}
            </SheetTrigger>

            <SheetContent side={side} className="w-70 p-0">
                <SheetHeader className="p-5 border-b border-border bg-secondary/30">
                    <SheetTitle className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 rounded-2xl">
                            <AvatarFallback className="bg-linear-to-br from-primary/20 to-accent/20 text-foreground font-bold rounded-2xl text-lg">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                            <span className="text-lg font-bold select-none cursor-default">
                                {user?.firstName} {user?.lastName}
                            </span>
                            <span className="text-sm text-muted-foreground font-normal select-none cursor-default">
                                {user?.role?.name}
                            </span>
                        </div>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col p-3 gap-1">
                    {menuLinks.map(({to, icon: Icon, label }) => (
                        <Link key={to} to={to} className="flex items-center gap-3 px-4 py-3.5 text-foreground hover:bg-secondary rounded-xl transition-colors active:bg-secondary/80">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">
                                {label}
                            </span>
                        </Link>
                    ))}

                    <CardDialog>
                        <button className={"flex items-center gap-3 px-4 py-3.5 text-foreground hover:bg-secondary rounded-xl transition-colors w-full text-left"}>
                            <QrCode className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">
                                La mia tessera
                            </span>
                        </button>
                    </CardDialog>

                    <div className="my-2 border-t border-border" />

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3.5 text-destructive hover:bg-destructive/10 rounded-xl transition-colors active:bg-destructive/20"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">
                            Logout
                        </span>
                    </button>
                </div>
            </SheetContent>
        </Sheet>
    )
}