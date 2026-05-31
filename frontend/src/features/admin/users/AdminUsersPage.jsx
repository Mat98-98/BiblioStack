import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input.jsx";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.jsx";
import { useAdminUsers } from "@/features/admin/users/useAdminUsers.js";
import UsersTable from "@/features/admin/users/UsersTable.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Link } from "react-router-dom";

export default function AdminUsersPage() {
    const {
        users, loading, hasMore, page, search,
        setSearch, setPage,
        updateRole, deleteUser, suspendUser, updateUser
    } = useAdminUsers()

    return (
        <div className="space-y-6">

            <div className="flex items-start justify-between gap-4">

                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">Utenti</h1>
                    <p className="text-sm text-muted-foreground">
                        Gestisci gli utenti della biblioteca
                    </p>
                </div>

                <Button asChild>
                    <Link to="/admin/users/add" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Aggiungi utente
                    </Link>
                </Button>

            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    className="pl-10"
                    placeholder="Cerca per nome, cognome o email..."
                    defaultValue={search}
                    onKeyDown={e => {
                        if (e.key === "Enter") setSearch(e.target.value)
                    }}
                    onBlur={e => setSearch(e.target.value)}
                />
            </div>

            <UsersTable
                users={users}
                loading={loading}
                onUpdateRole={updateRole}
                onDelete={deleteUser}
                onSuspend={suspendUser}
                onEdit={updateUser}
            />

            {(page > 1 || hasMore) && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setPage(page - 1)}
                                aria-disabled={page === 1 || loading}
                                className={page === 1 || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <span className="px-4 py-2 text-sm text-muted-foreground">
                                Pagina {page}
                            </span>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setPage(page + 1)}
                                aria-disabled={!hasMore || loading}
                                className={!hasMore || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}

        </div>
    )
}