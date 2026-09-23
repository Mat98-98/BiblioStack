import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { BookMarked, AlertTriangle } from "lucide-react";

import { useAdminUserDashboard } from "@/features/users/profile/management/hooks/useAdminUserDashboard.js";
import { useAdminUserLoans } from "@/features/users/profile/management/hooks/useAdminUsersLoans.js";

import { noticesColumns } from "@/features/users/profile/management/components/NoticesColumns.jsx";
import { getReservationColumns } from "@/features/reservations/components/ReservationColumns.jsx";

import ChangeRoleDialog from "@/features/users/management/dialogs/changeRoleDialog/ChangeRoleDialog.jsx";
import SuspendUserDialog from "@/features/users/management/dialogs/suspendUserDialog/SuspendUserDialog.jsx";
import AdminUserActions from "@/features/users/profile/management/components/AdminUserActions.jsx";
import AdminProfileHeader from "@/features/users/profile/management/components/AdminProfileHeader.jsx";
import SuspensionCard from "@/features/users/profile/management/components/SuspensionCard.jsx";

import DataTableClientSide from "@/features/users/profile/management/components/DataTableClientSide.jsx";
import LoansFilters from "@/features/loans/components/LoanFilters.jsx";
import LoansTable from "@/features/loans/components/LoanTable.jsx";

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
        refetch,
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

    const [suspendOpen, setSuspendOpen] = useState(false);
    const [changeRoleOpen, setChangeRoleOpen] = useState(false);

    const reservationsColumns = getReservationColumns({
        onCancel: cancelReservation,
        showAllColumns: true,
    });

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

            {/* Prenotazioni - per ora invariato */}
            <section className="space-y-3">
                <h2 className="text-base font-semibold">Prenotazioni</h2>

                <DataTableClientSide
                    columns={reservationsColumns}
                    data={user.reservations}
                    searchColumnId="workTitle"
                    searchPlaceholder="Cerca per titolo..."
                    emptyIcon={BookMarked}
                    emptyMessage="Nessuna prenotazione"
                    initialSorting={[
                        { id: "reservationDate", desc: true }
                    ]}
                />
            </section>

            {/* Segnalazioni - per ora invariato */}
            <section className="space-y-3">
                <h2 className="text-base font-semibold">
                    Segnalazioni ricevute
                </h2>

                <DataTableClientSide
                    columns={noticesColumns}
                    data={user.noticesReceived}
                    emptyIcon={AlertTriangle}
                    emptyMessage="Nessuna segnalazione"
                    initialSorting={[
                        { id: "issuedAt", desc: true }
                    ]}
                />
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