import {
    Pagination, PaginationContent, PaginationItem,
    PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination.jsx"

export default function TablePagination({ page, hasMore, onPage, loading }) {
    if (page === 1 && !hasMore) return null

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => onPage(page - 1)}
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
                        onClick={() => onPage(page + 1)}
                        aria-disabled={!hasMore || loading}
                        className={!hasMore || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}