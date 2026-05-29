import { Link } from "react-router-dom"
import { BookOpen } from "lucide-react"

export default function NavbarLogo() {
    return (
        <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>

            <div className="hidden sm:flex flex-col">
                <span className="font-bold">BiblioStack</span>
                <span className="text-xs text-muted-foreground">La biblioteca smart</span>
            </div>
        </Link>
    )
}