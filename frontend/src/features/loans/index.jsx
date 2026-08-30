import { useLoan } from "@/features/loans/hooks/useLoan.js";
import LoansHeader from "@/features/loans/components/LoansHeader.jsx";
import TablePagination from "@/components/common/TablePagination.jsx";
import LoansTable from "@/features/loans/components/LoanTable.jsx";
import api from "@/api/axios.js";
import { notify } from "@/lib/notify.js";
import { handleApiError } from "@/lib/handleApiError.js";
import LoansFilters from "@/features/loans/components/LoanFilters.jsx";



export default function Loans({ workId, userId }) {
    const {
        loans, loading, page, setPage, limit, setLimit, hasMore, refetch,
        search, setSearch, status, setStatus,
        sortBy, sortOrder, setSortBy, setSortOrder,
        createNotice
    } = useLoan( { workId, userId });


    const handleDeleteOpen = async (loanId) => {
        try {
            await api.delete(`loans/${loanId}`);
            notify.success("Prestito eliminato con successo");
            refetch();
        } catch (error) {
            handleApiError(error);
        }
    }

    const handleSort = (field, order) => {
        setSortBy(field);
        setSortOrder(order);
    }

    return (
        <div className="space-y-6">
            <LoansHeader onLoanAdded={refetch} onNotify={createNotice} />

            <LoansFilters
                search={search} onSearch={setSearch}
                status={status} onStatus={setStatus}
                sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}
            />

            <LoansTable
                loans={loans}
                loading={loading}
                onEdit={refetch}
                onDelete={handleDeleteOpen}
                onNotify={createNotice}
            />

            <TablePagination
                page={page}
                hasMore={hasMore}
                onPage={setPage}
                loading={loading}
                limit={limit}
                onLimit={setLimit}
            />
        </div>
    );
}