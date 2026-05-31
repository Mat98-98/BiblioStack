import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input.jsx";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.jsx";
import { useAdminWorks } from "@/features/admin/works/useAdminWorks.js";
import WorksTable from "@/features/admin/works/WorksTable.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Link } from "react-router-dom";

export default function AdminWorksPage() {
    const {
        works, loading, hasMore, page, search,
        setSearch, setPage,
        deleteWork, updateWork
    } = useAdminWorks()

    return (
        <div className="space-y-6">

            <div className="flex items-start justify-between gap-4">

                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">Opere</h1>
                    <p className="text-sm text-muted-foreground">
                        Gestisci le opere della biblioteca
                    </p>
                </div>

                <Button asChild>
                    <Link to="/admin/works/add" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Aggiungi opera
                    </Link>
                </Button>

            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    className="pl-10"
                    placeholder="Cerca per titolo, autore o ISBN..."
                    defaultValue={search}
                    onKeyDown={e => {
                        if (e.key === "Enter") setSearch(e.target.value)
                    }}
                    onBlur={e => setSearch(e.target.value)}
                />
            </div>

            <WorksTable
                works={works}
                loading={loading}
                onDelete={deleteWork}
                onEdit={updateWork}
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