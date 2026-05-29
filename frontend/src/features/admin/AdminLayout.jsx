import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator.jsx"
import AdminSidebar from "./AdminSidebar"

export default function AdminLayout() {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                <header className="flex h-14 items-center gap-2 border-b border-border px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="h-4" />
                </header>
                <div className="p-6">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}