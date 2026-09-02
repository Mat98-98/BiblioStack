import { useAuth } from "@/context/AuthContext.jsx";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import UserAccountSheet from "@/components/common/userMenu/UserAccountSheet.jsx";
import UserAccountMenu from "@/components/common/userMenu/UserAccountMenu.jsx";


function useUserMenu() {
    const { user } = useAuth();
    const initials = user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}` : "?";
    return { user, initials };
}

// Desktop
export function DesktopMenu() {
    const { initials } = useUserMenu();

    return (
        <div className="hidden sm:block">
            <UserAccountMenu
                side="bottom"
                align="end"
                trigger={
                    <Button variant="ghost" className="p-0">
                        <Avatar>
                            <AvatarFallback>
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                }
            >
            </UserAccountMenu>
        </div>
    )
};

// Mobile
export function MobileMenu() {
    return (
        <div className="sm:hidden">
            <UserAccountSheet
                side="right"
                trigger={
                    <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10">
                        <Menu className="h-5 w-5 text-muted-foreground" />
                    </Button>
                }
            >
            </UserAccountSheet>
        </div>
    )
}

