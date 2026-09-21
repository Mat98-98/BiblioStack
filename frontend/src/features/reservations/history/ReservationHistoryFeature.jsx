import { useMyReservations } from "@/features/reservations/history/useMyReservations.js";
import ReservationsTable from "@/features/reservations/components/ReservationTable.jsx";
import ReservationFilters from "@/features/reservations/components/ReservationFilters.jsx";
import TablePagination from "@/components/common/TablePagination.jsx";

export default function ReservationHistoryFeature() {
    const {
        reservations, loading,
        search, setSearch,
        status, setStatus,
        sortOrder, setSortOrder,
        page, setPage, hasMore,
        cancelReservation
    } = useMyReservations();

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Le mie prenotazioni</h1>
                <p className="text-sm text-muted-foreground">
                    Storico completo delle tue prenotazioni
                </p>
            </div>

            <ReservationFilters
                search={search} onSearch={setSearch}
                status={status} onStatus={setStatus}
                sortOrder={sortOrder} onSort={setSortOrder}
                isStaff={false}
            />

            {/* showUser: default false, è sempre e solo l'utente loggato */}
            <ReservationsTable
                reservations={reservations}
                loading={loading}
                onCancel={cancelReservation}
                showAllColumns={false}
            />

            <TablePagination page={page} hasMore={hasMore} onPage={setPage} loading={loading} />
        </div>
    );
}