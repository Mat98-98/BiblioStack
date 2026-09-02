import { Link } from "react-router-dom"
import { Search, X, Bell, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button.jsx"
import { notify } from "@/lib/notify.js";
import { DesktopMenu, MobileMenu } from "@/components/layout/navbar/NavbarMenu.jsx"
import { useMobileSearch, MobileSearchBar } from "@/components/layout/navbar/NavbarSearch.jsx"
import { useAuth } from "@/context/AuthContext.jsx"
import NavbarLogin from "@/components/layout/navbar/NavbarLogin.jsx"
import NavbarThemeToggle from "@/components/layout/navbar/NavbarThemeToggle.jsx"

export default function NavbarActions() {
    const { open, toggle } = useMobileSearch()
    const { user, isAuthenticated } = useAuth()

    return (
        <>
            <div className="flex items-center gap-2">

                <Button variant="ghost" size="icon" className="md:hidden" onClick={toggle}>
                    {open ? <X /> : <Search />}
                </Button>

                {user?.role?.name === "admin" && (
                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/admin">
                            <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
                        </Link>
                    </Button>
                )}

                <NavbarThemeToggle />

                {isAuthenticated ? (
                    <>
                        <Button variant="ghost" size="icon" onClick={() => notify.info("Notifiche al momento non implementate!")}>
                            <Bell />
                        </Button>
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