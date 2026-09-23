import { PackageX } from "lucide-react";
import { getLoansColumns } from "@/features/loans/components/LoanColumns.jsx";
import DataTable from "@/components/common/DataTable.jsx";

export default function LoansTable({
                                       loans,
                                       loading,
                                       onEdit,
                                       onNotify,
                                       showAllColumns = true,
                                       showPatron = true,
                                       pagination,
                                   }) {
    const columns = getLoansColumns({
        onEdit,
        onNotify,
        showAllColumns,
        showPatron,
    });

    return (
        <DataTable
            data={loans}
            columns={columns}
            loading={loading}
            emptyIcon={PackageX}
            emptyMessage="Nessun prestito trovato"
            pagination={pagination}
        />
    );
}