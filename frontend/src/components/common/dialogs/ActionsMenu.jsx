/*
Questo componente è il menu dropdown con i 3 puntini
 */

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";

export function ActionsMenu({ children, align = "end" }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} className="w-52">
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}