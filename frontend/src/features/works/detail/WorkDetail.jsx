import { useAuth } from "@/context/AuthContext.jsx";
import { handleApiError } from "@/lib/handleApiError.js";
import { notify } from "@/lib/notify.js";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty.jsx";
import api from "@/api/axios.js";
import WorkReservationButton from "@/features/works/detail/components/WorkReservationButton.jsx";
import DetailWorkDetailSkeleton from "@/features/works/detail/components/DetailWorkSkeleton.jsx";
import DetailWorkCover from "@/features/works/detail/components/DetailWorkCover.jsx";
import DetailWorkInfoGrid from "@/features/works/detail/components/DetailWorkInfoGrid.jsx";
import DetailWorkDescription from "@/features/works/detail/components/DetailWorkDescription.jsx";
import StaffItemsTable from "@/features/items/management/components/StaffItemsTable.jsx";
import WorkReservationQueue from "@/features/works/detail/components/WorkReservationQueue.jsx";



export default function WorkDetail({ work, loading, error, refetch }) {
    const { user, isAuthenticated } = useAuth();

    if (loading) return <DetailWorkDetailSkeleton />;

    if (error || !work) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <BookOpen />
                    </EmptyMedia>
                    <EmptyTitle>Opera non trovata</EmptyTitle>
                    <EmptyDescription>
                        Il libro richiesto potrebbe essere stato rimosso o l'indirizzo non è corretto.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    const isStaff = user?.role?.name === "librarian" || user?.role?.name === "admin";
    const isAdmin = user?.role?.name === "admin";
    const authors = work.authors?.map(a => `${a.firstName} ${a.lastName}`).join(", ") || "—";
    const available = work.availableCount ?? 0;


    const handleDeleteItem = async (itemId) => {
        try {
            await api.delete(`/items/${itemId}`);
            notify.success("Copia eliminata");
            refetch();
        } catch (err) {
            handleApiError(err);
        }
    };

    return (
        <div className="flex flex-col gap-6 pt-12">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
                <DetailWorkCover coverUrl={work.coverUrl} title={work.title}/>

                <div className="flex flex-col gap-5 flex-1 min-w-0">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold leading-tight">{work.title}</h1>
                        <p className="text-lg text-muted-foreground">{authors}</p>
                    </div>

                    {/* Generi */}
                    {work.genres?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {work.genres.map(g => (
                                <Badge key={g.id} variant="secondary">
                                    {g.name}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Prenota */}
                    <div className="flex items-center gap-8 flex-wrap">
                        <div
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium w-fit ${available > 0 ? "bg-success/20 text-success" : "bg-destructive/10 text-destructive"}`}>
                            <div className={`h-2 w-2 rounded-full ${available > 0 ? "bg-success" : "bg-destructive"}`}/>
                            {available > 0 ? `${available} cop${available === 1 ? "ia disponibile" : "ie disponibili"}` : "Non disponibile"}
                        </div>

                        {isAuthenticated && <WorkReservationButton work={work}/>}
                    </div>

                    <DetailWorkInfoGrid work={work}/>
                </div>
            </div>

            <DetailWorkDescription description={work.description}/>

            {isStaff && work.items?.length > 0 && (
                <>
                    <StaffItemsTable items={work.items} isAdmin={isAdmin} onEdit={refetch} onDelete={handleDeleteItem}/>
                    <WorkReservationQueue reservations={work.activeReservations}/>
                </>
            )}
        </div>
    );
}
