import { useTheme } from "@/components/theme/theme-provider.jsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx"

import { Button } from "@/components/ui/button.jsx"
import { Sun, Moon, Monitor } from "lucide-react"

export default function NavbarThemeToggle() {
    const { setTheme, theme } = useTheme()

    const itemClass =
        "cursor-pointer rounded-lg h-10 px-3 flex items-center w-full"

    const activeClass =
        "ml-auto text-xs text-primary font-medium whitespace-nowrap"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-secondary rounded-xl h-10 w-10 relative"
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-muted-foreground" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-muted-foreground" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-56 p-2 rounded-xl"
            >
                <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className={itemClass}
                >
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Chiaro</span>
                    {theme === "light" && <span className={activeClass}>Attivo</span>}
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className={itemClass}
                >
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Scuro</span>
                    {theme === "dark" && <span className={activeClass}>Attivo</span>}
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => setTheme("system")}
                    className={itemClass}
                >
                    <Monitor className="mr-2 h-4 w-4" />
                    <span>Sistema</span>
                    {theme === "system" && <span className={activeClass}>Attivo</span>}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}