import { useCatalog } from "./hooks/useCatalog.js"
import { useCatalogFilters } from "./hooks/useCatalogFilters.js"
import CatalogSidebar from "./components/CatalogSidebar.jsx"
import CatalogGrid from "./components/CatalogGrid.jsx"
import CatalogPagination from "./components/CatalogPagination.jsx"

export default function Catalog() {
    const {
        works, loading, hasMore, page,
        limit, setLimit,
        search, filters, activeFiltersCount,
        setFilter, setPage, clearFilters,
    } = useCatalog()

    const { genres, languages, publishers } = useCatalogFilters()
    const hasFilters = activeFiltersCount > 0 || !!search

    const filterProps = {
        filters, genres, languages, publishers,
        onFilter: setFilter,
        onClear: clearFilters,
        activeCount: activeFiltersCount,
    }

    return (
        <div className="flex gap-8 pt-5">

            <CatalogSidebar filterProps={filterProps} activeFiltersCount={activeFiltersCount} />

            <div className="flex-1 space-y-6 min-w-0">
                <CatalogGrid works={works} loading={loading} hasFilters={hasFilters} />
                <CatalogPagination page={page} hasMore={hasMore} onPage={setPage} loading={loading} limit={limit} onLimit={setLimit} />
            </div>
        </div>
    )
}