import { BookX } from "lucide-react";
import { getReservationColumns } from "@/features/reservations/components/ReservationColumns.jsx";
import DataTable from "@/components/common/DataTable.jsx";

export default function ReservationsTable({
                                              reservations,
                                              loading,
                                              onCancel,
                                              showAllColumns = true,
                                              showUserColumn = true,
                                              pagination,
                                          }) {
    const columns = getReservationColumns({
        onCancel,
        showAllColumns,
        showUserColumn
    });

    return (
        <DataTable
            data={reservations}
            columns={columns}
            loading={loading}
            emptyIcon={BookX}
            emptyMessage="Nessuna prenotazione trovata"
            pagination={pagination}
        />
    );
}