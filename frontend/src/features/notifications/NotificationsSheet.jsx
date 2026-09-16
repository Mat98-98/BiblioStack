import { useRef, useState } from "react";
import { BellOff, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet.jsx";
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemTitle,
} from "@/components/ui/item.jsx";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.jsx";
import { useMarkNotificationAsRead } from "@/features/notifications/useMarkNotificationAsRead.js";
import { cn } from "@/lib/utils.js";
import { safeFormat } from "@/lib/dateUtils.js";

export default function NotificationSheet({
                                              open,
                                              onOpenChange,
                                              notifications,
                                              isLoading,
                                              onNotificationRead
                                          }) {
    const [expandedId, setExpandedId] = useState(null);
    const [showBottomFade, setShowBottomFade] = useState(false);
    const scrollRef = useRef(null);
    const { markAsRead } = useMarkNotificationAsRead();

    // Mostra la dissolvenza solo se c'è altro contenuto da scorrere
    const updateFadeVisibility = () => {
        const el = scrollRef.current;
        if (!el) return;
        const hasOverflow = el.scrollHeight > el.clientHeight;
        const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 4;
        setShowBottomFade(hasOverflow && !isAtBottom);
    };

    // Ricalcola quando cambia la lista (es. dopo il fetch iniziale)
    const scrollContainerRef = (node) => {
        scrollRef.current = node;
        if (node) {
            requestAnimationFrame(updateFadeVisibility);
        }
    };

    const handleClick = (notification) => {
        if (!notification.readAt) {
            onNotificationRead(notification.id);

            markAsRead(notification.id).catch(() => {
                // L'errore è già gestito da useMarkNotificationAsRead
            });
        }

        setExpandedId((prev) =>
            prev === notification.id ? null : notification.id
        );
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="flex flex-col p-0">
                <SheetHeader className="px-4 pt-4">
                    <SheetTitle className="text-xl pt-3">Notifiche</SheetTitle>
                </SheetHeader>

                {/* relative: fa da riferimento per la dissolvenza in overlay, che così non scorre col contenuto */}
                <div className="relative flex-1 min-h-0">
                    <div
                        ref={scrollContainerRef}
                        onScroll={updateFadeVisibility}
                        className="h-full overflow-y-auto px-4 pt-2 pb-6"
                    >
                        {isLoading && (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                        )}

                        {!isLoading && notifications.length === 0 && (
                            <Empty>
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <BellOff />
                                    </EmptyMedia>
                                    <EmptyTitle>Nessuna notifica</EmptyTitle>
                                </EmptyHeader>
                            </Empty>
                        )}

                        {!isLoading && notifications.length > 0 && (
                            <ItemGroup>
                                {notifications.map((notification) => {
                                    const isUnread = !notification.readAt;
                                    const isExpanded =
                                        expandedId === notification.id;

                                    return (
                                        <Item
                                            key={notification.id}
                                            asChild
                                            size="sm"
                                            className={cn(
                                                "cursor-pointer rounded-lg transition-colors hover:bg-muted",
                                                isUnread && "bg-muted/60"
                                            )}
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleClick(notification)
                                                }
                                            >
                                                <ItemContent>
                                                    <ItemTitle
                                                        className={cn(
                                                            isUnread &&
                                                            "font-semibold"
                                                        )}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            {notification.title}

                                                            {isUnread && (
                                                                <span
                                                                    className="h-2 w-2 shrink-0 rounded-full bg-destructive"
                                                                    aria-label="Non letta"
                                                                />
                                                            )}
                                                        </span>
                                                    </ItemTitle>

                                                    <ItemDescription
                                                        className={cn(
                                                            "mt-1",
                                                            !isExpanded &&
                                                            "line-clamp-2"
                                                        )}
                                                    >
                                                        {notification.message}
                                                    </ItemDescription>

                                                    <span className="mt-1 text-xs text-muted-foreground/70">
                                                        {safeFormat(
                                                            notification.createdAt
                                                        )}
                                                    </span>
                                                </ItemContent>
                                            </button>
                                        </Item>
                                    )
                                })}
                            </ItemGroup>
                        )}
                    </div>

                    {showBottomFade && (
                        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-background to-transparent" />
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}