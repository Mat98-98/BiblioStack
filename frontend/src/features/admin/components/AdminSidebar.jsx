import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    BookMarked,
    CalendarClock,
    LogOut
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

const navItems = [
    {
        label: "Generale",
        items: [
            { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
        ]
    },
    {
        label: "Gestione",
        items: [
            { to: "/admin/users",        icon: Users,         label: "Utenti"       },
            { to: "/admin/works",        icon: BookOpen,      label: "Opere"        },
            { to: "/admin/loans",        icon: BookMarked,    label: "Prestiti"     },
            { to: "/admin/reservations", icon: CalendarClock, label: "Prenotazioni" },
        ]
    },
]

export default function AdminSidebar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const initials = user
        ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`
        : "?"

    const handleLogout = async () => {
        await logout()
        navigate("/login")
    }

    return (
        <Sidebar>
            <SidebarHeader className="p-4 border-b border-border">
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary">
                        <BookOpen className="h-5 w-5 text-primary-foreground" />
                    </div>

                    <div className="hidden sm:flex flex-col">
                        <span className="font-bold">BiblioStack</span>
                        <span className="text-xs text-muted-foreground">Admin</span>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent>
                {navItems.map(group => (
                    <SidebarGroup key={group.label}>
                        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map(item => (
                                    <SidebarMenuItem key={item.to}>
                                        <SidebarMenuButton asChild>
                                            <NavLink
                                                to={item.to}
                                                end={item.end}
                                                className={({ isActive }) =>
                                                    isActive ? "text-primary font-medium" : ""
                                                }
                                            >
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.label}</span>
                                            </NavLink>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-border">
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg text-xs">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-medium truncate">
                            {user?.firstName} {user?.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                            {user?.email}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}