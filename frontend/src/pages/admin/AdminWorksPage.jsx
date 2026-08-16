import SearchBar from "@/components/common/SearchBar.jsx";
import TablePagination from "@/components/common/TablePagination.jsx";
import WorksHeader from "@/features/works/management/components/WorksHeader.jsx";
import WorksTable from "@/features/works/management/table/WorksTable.jsx";
import { useAdminWorks } from "@/features/works/management/hooks/useAdminWorks.js";


export default function AdminWorksPage() {
    const {
        works, loading, hasMore, page, search,
        setSearch, setPage,
        deleteWork, updateWork
    } = useAdminWorks()

    return (
        <div className="space-y-6">
            <WorksHeader/>
            <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Cerca per titolo, autore o ISBN..."
            />
            <WorksTable
                works={works}
                loading={loading}
                onDelete={deleteWork}
                onEdit={updateWork}
            />
            <TablePagination
                page={page}
                loading={loading}
                onPage={setPage}
                hasMore={hasMore}
            />
        </div>
    )
}