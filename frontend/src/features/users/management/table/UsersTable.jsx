import { UserX } from "lucide-react";
import { getUserColumns } from "@/features/users/management/table/UserTableColumns.jsx";
import DataTable from "@/components/common/DataTable.jsx";

export default function UsersTable({ users, loading, onUpdateRole, onDelete, onSuspend, onUnsuspend, onEdit }) {
    const columns = getUserColumns({ onUpdateRole, onDelete, onSuspend, onUnsuspend, onEdit })

    return (
       <DataTable
           data={users}
           columns={columns}
           loading={loading}
           emptyIcon={UserX}
           emptyMessage="Nessun utente trovato"
       />
    );
}