import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.jsx";

export default function TablePagination({ page, hasMore, onPage, loading }) {
    if (page === 1 && !hasMore) return null

    const prevDisabled = page === 1 || loading
    const nextDisabled = !hasMore || loading

    return (
        <Pagination>
            <PaginationContent>

                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => {
                            if (!prevDisabled) onPage(page - 1)
                        }}
                        aria-disabled={prevDisabled}
                        className={prevDisabled ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>

                <PaginationItem>
                    <span className="px-4 py-2 text-sm text-muted-foreground">
                        Pagina {page}
                    </span>
                </PaginationItem>

                <PaginationItem>
                    <PaginationNext
                        onClick={() => {
                            if (!nextDisabled) onPage(page + 1)
                        }}
                        aria-disabled={nextDisabled}
                        className={nextDisabled ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>

            </PaginationContent>
        </Pagination>
    )
}