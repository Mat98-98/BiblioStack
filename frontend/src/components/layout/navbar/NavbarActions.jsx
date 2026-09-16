import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, Bell, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { DesktopMenu, MobileMenu } from "@/components/layout/navbar/NavbarMenu.jsx";
import { useMobileSearch, MobileSearchBar } from "@/components/layout/navbar/NavbarSearch.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import NavbarLogin from "@/components/layout/navbar/NavbarLogin.jsx";
import NavbarThemeToggle from "@/components/layout/navbar/NavbarThemeToggle.jsx";
import NotificationSheet from "@/features/notifications/NotificationsSheet.jsx";
import { useNotificationPreview } from "@/features/notifications/useNotifications.js";

export default function NavbarActions() {
    const { open, toggle } = useMobileSearch();
    const { user, isAuthenticated } = useAuth();
    const [ notificationsOpen, setNotificationsOpen ] = useState(false);

    const { notifications, isLoading, hasUnread, refetch, markAsReadLocally } = useNotificationPreview(isAuthenticated);

    const handleOpenChange = (nextOpen) => {
        setNotificationsOpen(nextOpen);
        if (nextOpen) {
            void refetch(); // Aggiorna i dati ogni volta che si apre la sheet
        }
    };

    return (
        <>
            <div className="flex items-center gap-2">

                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label={open ? "Chiudi ricerca" :"Cerca"}
                    onClick={toggle}
                >
                    {open ? <X /> : <Search />}
                </Button>

                {user?.role?.name === "admin" && (
                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/admin" aria-label="Dashboard">
                            <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
                        </Link>
                    </Button>
                )}

                <NavbarThemeToggle />

                {isAuthenticated ? (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label={hasUnread ? "Notifiche non lette" : "Notifiche"}
                            className="relative"
                            onClick={() => handleOpenChange(true)}
                        >
                            <Bell />
                            {hasUnread && (
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" aria-hidden="true"/>
                            )}
                        </Button>

                        <NotificationSheet
                            open={notificationsOpen}
                            onOpenChange={handleOpenChange}
                            notifications={notifications}
                            isLoading={isLoading}
                            onNotificationRead={markAsReadLocally}
                        />
                        <DesktopMenu />
                        <MobileMenu />
                    </>
                ) : (
                    <NavbarLogin />
                )}
            </div>

            <MobileSearchBar open={open} />
        </>
    )
}