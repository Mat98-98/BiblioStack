import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, QrCode } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import CardDialog from "@/features/qrCode/CardDialog.jsx";

const menuLinks = [
    { to: "/profile", icon: User, label: "Profilo" }
];

/*
    Dropdown con i dati dell'utente (profilo, tessera e logoutn), usato sia nella Navbar pubblica che nella admin sidebar. Non è visualizzato con schermi piccoli (sm), per quello c'è UserAccountSheet.jsx
    Il parametro side è configurabile con ["top"|"right"|"bottom"|"left"]
    Il parametro align è configurabile con ["start"|"center"|"end"]
 */
export default function UserAccountMenu({ trigger, side = "bottom", align= "end"}) {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {trigger}
            </DropdownMenuTrigger>

            <DropdownMenuContent align={align} side={side} className="w-56">
                <div className="p-2 font-medium select-none cursor-default">
                    {user?.firstName} {user?.lastName}
                </div>

                <DropdownMenuSeparator />

                {menuLinks.map(({to, icon: Icon, label}) => (
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

                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}