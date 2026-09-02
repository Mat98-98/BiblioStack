import NavbarLogo from "@/components/layout/navbar/NavbarLogo.jsx";
import NavbarActions from "@/components/layout/navbar/NavbarActions.jsx";
import { DesktopSearch } from "@/components/layout/navbar/NavbarSearch.jsx";


export default function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
            <nav className="mx-auto w-full px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 sm:h-18 items-center justify-between gap-2 sm:gap-4">
                    <NavbarLogo />
                    <DesktopSearch />
                    <NavbarActions />
                </div>
            </nav>
        </header>
    )
}