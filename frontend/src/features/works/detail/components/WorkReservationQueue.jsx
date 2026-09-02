import { Badge } from "@/components/ui/badge.jsx"
import { Clock, PackageCheck } from "lucide-react";
import { safeFormat } from "@/lib/dateUtils.js";
import {Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle} from "@/components/ui/item.jsx";

export default function WorkReservationQueue({ reservations }) {
    if (!reservations || reservations.length === 0) return null;

    const pendingCount = reservations.filter(r => r.status === "pending").length;
    const readyCount = reservations.filter(r => r.status === "ready").length;

    return (
         <div className="w-full border-t pt-6 space-y-3">
             <div className="flex items-center gap-2">
                 <h2 className="text-lg font-semibold">Prenotazioni attive</h2>
                 {pendingCount > 0 && <Badge variant="outline">{pendingCount} in coda</Badge> }
                 {readyCount > 0 && <Badge variant="outline" className="border-primary text-primary">{readyCount} pronte al ritiro</Badge>}
             </div>

             <ItemGroup>
                 {reservations.map((r, i) => (
                     <Item key={r.id} size="sm">
                         <ItemMedia variant="icon">
                             {r.status === "ready" ? (
                                 <PackageCheck className="h-4 w-4 text-primary" />
                             ) : (
                                 <Clock className="h-4 w-4 text-muted-foreground" />
                             )}
                         </ItemMedia>
                         <ItemContent>
                             <ItemTitle>#{i + 1} · {r.user.firstName} {r.user.lastName}</ItemTitle>
                             <ItemDescription>
                                 {r.status === "ready" ? `Pronta - Scade il ${safeFormat(r.expiresAt)}` : `In coda dal ${safeFormat(r.reservationDate)}`}
                             </ItemDescription>

                         </ItemContent>
                     </Item>
                 ))}
             </ItemGroup>
         </div>
    )
}
