import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { useAdminUserDashboard } from "@/features/users/profile/management/hooks/useAdminUserDashboard.js";
import { useAdminUserLoans } from "@/features/users/profile/management/hooks/useAdminUsersLoans.js";
import { useAdminUserReservations } from "@/features/users/profile/management/hooks/useAdminUserReservations.js";
import ChangeRoleDialog from "@/features/users/management/dialogs/changeRoleDialog/ChangeRoleDialog.jsx";
import SuspendUserDialog from "@/features/users/management/dialogs/suspendUserDialog/SuspendUserDialog.jsx";
import AdminUserActions from "@/features/users/profile/management/components/AdminUserActions.jsx";
import AdminProfileHeader from "@/features/users/profile/management/components/AdminProfileHeader.jsx";
import SuspensionCard from "@/features/users/profile/management/components/SuspensionCard.jsx";
import LoansFilters from "@/features/loans/components/LoanFilters.jsx";
import LoansTable from "@/features/loans/components/LoanTable.jsx";
import ReservationFilters from "@/features/reservations/components/ReservationFilters.jsx";
import ReservationsTable from "@/features/reservations/components/ReservationTable.jsx";
import NoticesTable from "@/features/notices/components/NoticesTable.jsx";

function AdminDashboardSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
        </div>
    );
}

export default function AdminUserDashboard({ userId }) {
    const {
        user,
        loading,
        error,
        cancelReservation,
        suspendUser,
        unsuspendUser,
        updateRole,
        createNotice
    } = useAdminUserDashboard(userId);

    const {
        loans,
        loading: loansLoading,
        page: loansPage,
        setPage: setLoansPage,
        hasMore: loansHasMore,
        search: loansSearch,
        setSearch: setLoansSearch,
        status: loansStatus,
        setStatus: setLoansStatus,
        sortBy: loansSortBy,
        sortOrder: loansSortOrder,
        setSort: setLoansSort,
        refetch: refetchLoans,
    } = useAdminUserLoans(userId);

    const {
        reservations,
        loading: reservationsLoading,
        page: reservationsPage,
        setPage: setReservationsPage,
        hasMore: reservationsHasMore,
        search: reservationsSearch,
        setSearch: setReservationsSearch,
        status: reservationsStatus,
        setStatus: setReservationsStatus,
        sortOrder: reservationsSortOrder,
        setSortOrder: setReservationsSortOrder,
        refetch: refetchReservations,
    } = useAdminUserReservations(userId);

    const [suspendOpen, setSuspendOpen] = useState(false);
    const [changeRoleOpen, setChangeRoleOpen] = useState(false);


    if (loading) return <AdminDashboardSkeleton />;

    if (error || !user) {
        return (
            <div className="text-center text-muted-foreground py-12">
                Errore nel caricamento del profilo.
            </div>
        );
    }

    const isSuspended = Boolean(
        user.suspension?.reason || user.suspension?.endDate
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:justify-between">
                <div className="flex-1">
                    <AdminProfileHeader user={user} />
                </div>

                <AdminUserActions
                    isSuspended={isSuspended}
                    onChangeRole={() => setChangeRoleOpen(true)}
                    onSuspend={() => setSuspendOpen(true)}
                    onUnsuspend={unsuspendUser}
                />
            </div>

            {isSuspended && (
                <SuspensionCard suspension={user.suspension} />
            )}

            {/* Prestiti */}
            <section className="space-y-3">
                <h2 className="text-base font-semibold">Prestiti</h2>

                <LoansFilters
                    search={loansSearch}
                    onSearch={setLoansSearch}
                    status={loansStatus}
                    onStatus={setLoansStatus}
                    sortBy={loansSortBy}
                    sortOrder={loansSortOrder}
                    onSort={setLoansSort}
                    searchPlaceholder="Cerca per titolo..."
                />

                <LoansTable
                    loans={loans}
                    loading={loansLoading}
                    onEdit={refetchLoans}
                    onNotify={createNotice}
                    showAllColumns
                    showPatron={false}
                    pagination={{
                        page: loansPage,
                        hasMore: loansHasMore,
                        onPage: setLoansPage,
                    }}
                />
            </section>

            {/* Prenotazioni */}
            <section className="space-y-3">
                <h2 className="text-base font-semibold">Prenotazioni</h2>

                <ReservationFilters
                    search={reservationsSearch}
                    onSearch={setReservationsSearch}
                    status={reservationsStatus}
                    onStatus={setReservationsStatus}
                    sortOrder={reservationsSortOrder}
                    onSort={setReservationsSortOrder}
                    isStaff
                />

                <ReservationsTable
                    reservations={reservations}
                    loading={reservationsLoading}
                    onCancel={async (reservationId) => {
                        const success = await cancelReservation(reservationId);

                        if (success) {
                            await refetchReservations();
                        }

                        return success;
                    }}
                    showAllColumns
                    showUserColumn={false}
                    pagination={{
                        page: reservationsPage,
                        hasMore: reservationsHasMore,
                        onPage: setReservationsPage,
                        loading: reservationsLoading,
                    }}
                />
            </section>

            {/* Segnalazioni */}
            <section className="space-y-3">
                <h2 className="text-base font-semibold">
                    Segnalazioni ricevute
                </h2>

                <NoticesTable notices={user.noticesReceived} />

            </section>

            <SuspendUserDialog
                user={user}
                open={suspendOpen}
                onClose={() => setSuspendOpen(false)}
                onConfirm={suspendUser}
            />

            <ChangeRoleDialog
                user={user}
                open={changeRoleOpen}
                onClose={() => setChangeRoleOpen(false)}
                onUpdated={updateRole}
            />
        </div>
    );
}