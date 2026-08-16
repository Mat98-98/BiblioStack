import { WorkActions } from "@/features/works/management/table/WorksTableActions.jsx";

export function getWorkColumns({ onDelete, onEdit }) {

    return [
        {
            id: "work",
            header: "Opera",
            cell: ({row}) => {
                const w = row.original
                return (
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-sm">
                            {w.title}
                        </span>
                    </div>
                )
            }
        },
        {
            id: "author",
            header: "Autore",
            cell: ({row}) => {
                const authors = row.original.authors

                return (
                    <div className="flex items-center gap-3">
                <span className="font-medium text-sm">
                    {authors?.length
                        ? authors.map(a => `${a.firstName} ${a.lastName}`).join(", ")
                        : "Autore sconosciuto"}
                </span>
                    </div>
                )
            }
        },
        {
            id: "actions",
            header: "",
            cell: ({row}) => (
                <div className="flex justify-end">
                    <WorkActions
                        work={row.original}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                </div>
            )
        }
    ]
}