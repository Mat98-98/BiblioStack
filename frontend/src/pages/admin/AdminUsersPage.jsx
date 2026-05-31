import { useState } from "react"
import { useAdminUsers } from "@/features/admin/users/hooks/useAdminUsers.js";
import CreateUserDialog from "@/features/admin/users/dialogs/createUserDialog/CreateUserDialog.jsx";
import UsersHeader from "@/features/admin/users/components/UsersHeader.jsx";
import UsersTable from "@/features/admin/users/table/UsersTable.jsx";
import TablePagination from "@/components/common/TablePagination.jsx";
import SearchBar from "@/components/common/SearchBar.jsx";

export default function AdminUsersPage() {
    const {
        users, loading, hasMore, page, search,
        setSearch, setPage,
        createUser, updateRole, updateUser, deleteUser, suspendUser,
    } = useAdminUsers()

    const [createOpen, setCreateOpen] = useState(false)

    return (
        <div className="space-y-6">
            <UsersHeader onCreateClick={() => setCreateOpen(true)} />
            <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Cerca per nome, cognome o email..."
            />
            <UsersTable
                users={users}
                loading={loading}
                onUpdateRole={updateRole}
                onDelete={deleteUser}
                onSuspend={suspendUser}
                onEdit={updateUser}
            />
            <TablePagination
                page={page}
                hasMore={hasMore}
                onPage={setPage}
                loading={loading}
            />
            <CreateUserDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onConfirm={createUser}
            />
        </div>
    )
}