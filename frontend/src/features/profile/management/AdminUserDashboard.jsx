import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { BookOpen, BookMarked, AlertTriangle } from "lucide-react";
import { useAdminUserDashboard } from "@/features/profile/management/hooks/useAdminUserDashboard.js";
import { noticesColumns } from "@/features/profile/management/components/NoticesColumns.jsx";
import { buildReservationsColumns } from "@/features/profile/management/components/ReservationsColumn.jsx";
import { getLoansColumns } from "@/features/loans/components/LoanColumns.jsx";
import ChangeRoleDialog from "@/features/users/management/dialogs/changeRoleDialog/ChangeRoleDialog.jsx";
import SuspendUserDialog from "@/features/users/management/dialogs/suspendUserDialog/SuspendUserDialog.jsx";
import AdminUserActions from "@/features/profile/management/components/AdminUserActions.jsx";
import AdminProfileHeader from "@/features/profile/management/components/AdminProfileHeader.jsx";
import SuspensionCard from "@/features/profile/management/components/SuspensionCard.jsx";
import DataTable from "@/features/profile/management/components/DataTable.jsx";

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
        user, loading, error,
        refetch,
        cancelReservation,
        suspendUser, unsuspendUser,
        updateRole, deleteLoan, createNotice
    } = useAdminUserDashboard(userId);

    const [suspendOpen, setSuspendOpen] = useState(false);
    const [changeRoleOpen, setChangeRoleOpen] = useState(false);

    const loansColumns = useMemo(
        () => getLoansColumns({ onEdit: refetch, onDelete: deleteLoan, onNotify: createNotice, showPatron: false }),
        [refetch, deleteLoan, createNotice]
    );
    const reservationsColumns = useMemo(() => buildReservationsColumns(cancelReservation), [cancelReservation]);

    if (loading) return <AdminDashboardSkeleton />;

    if (error || !user) {
        return (
            <div className="text-center text-muted-foreground py-12">
                Errore nel caricamento del profilo.
            </div>
        );
    }

    const isSuspended = Boolean(user.suspension?.reason || user.suspension?.endDate);

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

            {isSuspended && <SuspensionCard suspension={user.suspension} />}

            <section className="space-y-3">
                <h2 className="text-base font-semibold">Prestiti</h2>
                <DataTable
                    columns={loansColumns}
                    data={user.loansAsPatron}
                    searchColumnId="workTitle"
                    searchPlaceholder="Cerca per titolo..."
                    emptyIcon={BookOpen}
                    emptyMessage="Nessun prestito"
                    initialSorting={[{ id: "loanDate", desc: true }]}
                />
            </section>

            <section className="space-y-3">
                <h2 className="text-base font-semibold">Prenotazioni</h2>
                <DataTable
                    columns={reservationsColumns}
                    data={user.reservations}
                    searchColumnId="workTitle"
                    searchPlaceholder="Cerca per titolo..."
                    emptyIcon={BookMarked}
                    emptyMessage="Nessuna prenotazione"
                    initialSorting={[{ id: "reservationDate", desc: true }]}
                />
            </section>

            <section className="space-y-3">
                <h2 className="text-base font-semibold">Segnalazioni ricevute</h2>
                <DataTable
                    columns={noticesColumns}
                    data={user.noticesReceived}
                    emptyIcon={AlertTriangle}
                    emptyMessage="Nessuna segnalazione"
                    initialSorting={[{ id: "issuedAt", desc: true }]}
                />
            </section>

            <SuspendUserDialog user={user} open={suspendOpen} onClose={() => setSuspendOpen(false)} onConfirm={suspendUser} />
            <ChangeRoleDialog user={user} open={changeRoleOpen} onClose={() => setChangeRoleOpen(false)} onUpdated={updateRole} />
        </div>
    );
}