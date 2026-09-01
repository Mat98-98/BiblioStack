import { useEffect, useState } from "react";
import api from "@/api/axios.js";
import { getReadyReservationColumns } from "@/features/operatorDashboard/components/ReadyReservationColumns.jsx";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";

export default function ReadyReservationDialog({ open, onClose }) {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!open) return;

        const controller = new AbortController();

        const fetchReservations = async () => {
            setLoading(true);
            try {
                const res = await api.get("/operator-dashboard/ready-reservations", { params: { limit: 100 }, signal: controller.signal });
                setReservations(res.data);
            } catch (error) {
                if (error.name === "CanceledError" || error.name === "AbortError") return;
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();

        return () => controller.abort();
    }, [open]);

    const columns = getReadyReservationColumns();

    const table = useReactTable({
        data: reservations,
        columns,
        getCoreRowModel: getCoreRowModel()
    });

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
            <DialogContent className="sm:max-w-lg md:max-w-3xl lg:max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="text-xl">Prenotazioni pronte al ritiro</DialogTitle>
                    <DialogDescription>
                        Tutte le prenotazioni attualmente in attesa di ritiro.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-10 w-full" />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-border overflow-hidden">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map(hg => (
                                    <TableRow key={hg.id}>
                                        {hg.headers.map(h => (
                                            <TableHead key={h.id}>
                                                {flexRender(h.column.columnDef.header, h.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground text-sm">
                                            Nessuna prenotazione da ritirare
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    table.getRowModel().rows.map(row => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map(cell => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}