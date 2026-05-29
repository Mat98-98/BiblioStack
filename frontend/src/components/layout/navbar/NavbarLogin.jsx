import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";

export default function NavbarLogin() {
    return (
        <Button asChild className="sm:flex">
            <Link to="/login">Login</Link>
        </Button>
    )
}