import { BookX } from "lucide-react";
import { getWorkColumns } from "@/features/works/management/table/WorksTableColumns.jsx";
import DataTable from "@/components/common/DataTable.jsx";

export default function WorksTable({ works, loading, onDelete, onEdit }) {
    const columns = getWorkColumns( { onDelete, onEdit } );


    return (
      <DataTable
          data={works}
          columns={columns}
          loading={loading}
          emptyIcon={BookX}
          emptyMessage="Nessuna opera trovata"
      />
    );
}