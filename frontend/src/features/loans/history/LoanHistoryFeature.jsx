import { useMyLoans } from "@/features/loans/history/useMyLoans.js";
import LoansTable from "@/features/loans/components/LoanTable.jsx";
import LoansFilters from "@/features/loans/components/LoanFilters.jsx";
import TablePagination from "@/components/common/TablePagination.jsx";

export default function LoanHistoryFeature() {
    const {
        loans, loading,
        search, setSearch,
        status, setStatus,
        sortBy, sortOrder, setSort,
        page, setPage, hasMore
    } = useMyLoans();

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
            <div>
                <h1 className="text-2xl font-bold">I miei prestiti</h1>
                <p className="text-sm text-muted-foreground">
                    Storico completo dei tuoi prestiti
                </p>
            </div>

            <LoansFilters
                search={search}
                onSearch={setSearch}
                status={status}
                onStatus={setStatus}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={setSort}
                searchPlaceholder="Cerca per titolo..."
            />

            {/* showAllColumns: false -> niente colonne Copia/Bibliotecario/Azioni, solo lettura */}
            <LoansTable
                loans={loans}
                loading={loading}
                showAllColumns={false}
            />

            <TablePagination page={page} hasMore={hasMore} onPage={setPage} loading={loading} />
        </div>
    );
}