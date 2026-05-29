import { Search, X, Bell } from "lucide-react"
import { Button } from "@/components/ui/button.jsx"
import NavbarThemeToggle from "./NavbarThemeToggle"
import { DesktopMenu, MobileMenu } from "./NavbarMenu"
import { useMobileSearch, MobileSearchBar } from "./NavbarSearch"
import { useAuth } from "@/context/AuthContext.jsx";
import NavbarLogin from "@/components/layout/navbar/NavbarLogin.jsx";


export default function NavbarActions() {

    const { open, toggle } = useMobileSearch()
    const { isAuthenticated } = useAuth()

    // Se l'utente non è loggato mostra solo searchBar e button login
    return (
        <>
            <div className="flex items-center gap-2">

                {/* Searchbar */}
                <Button variant="ghost" size="icon" className="md:hidden" onClick={toggle}>
                    {open ? <X /> : <Search />}
                </Button>

                {/* Modalità chiara/scura/sistema */}
                <NavbarThemeToggle />

                {isAuthenticated ? (
                    <>
                        {/* Notifiche */}
                        <Button variant="ghost" size="icon">
                            <Bell />
                        </Button>
                        {/* Desktop avatar menu */}
                        <DesktopMenu />
                        {/* Mobile hamburger menu */}
                        <MobileMenu />
                    </>
                ) : (
                    // Pulsante login
                    <NavbarLogin/>
                )}
            </div>

            <MobileSearchBar open={open} />
        </>
    )
}