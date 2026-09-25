import { useCatalog } from "./hooks/useCatalog.js";
import CatalogSidebar from "./components/CatalogSidebar.jsx";
import CatalogGrid from "./components/CatalogGrid.jsx";
import TablePagination from "@/components/common/TablePagination.jsx";

export default function Catalog() {
    const {
        works, loading, hasMore, page,
        search, filters, activeFiltersCount,
        setFilter, setPage, clearFilters,
    } = useCatalog();

    const hasFilters = activeFiltersCount > 0 || !!search

    const filterProps = {
        filters,
        onFilter: setFilter,
        onClear: clearFilters,
        activeCount: activeFiltersCount,
    }

    return (
        <div className="flex gap-8 pt-5">

            <CatalogSidebar
                filterProps={filterProps}
                activeFiltersCount={activeFiltersCount}
            />

            <div className="flex-1 space-y-6 min-w-0">
                <CatalogGrid
                    works={works}
                    loading={loading}
                    hasFilters={hasFilters}
                />

                <TablePagination
                    page={page}
                    hasMore={hasMore}
                    onPage={setPage}
                    loading={loading}
                />
            </div>
        </div>
    )
}