import { useCallback, useEffect, useState } from "react";
import api from "@/api/axios.js";
import { handleApiError } from "@/lib/handleApiError.js";

// Hook per la Preview (usato nella Navbar / Sheet)
export function useNotificationPreview(enabled = true) {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPreview = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get("/notifications");
            setNotifications(data);
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (enabled) {
            fetchPreview();
        }
    }, [enabled, fetchPreview]);

    const markAsReadLocally = useCallback((id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, readAt: n.readAt ?? new Date().toISOString() } : n))
        );
    }, []);

    const hasUnread = notifications.some((n) => !n.readAt);

    return { notifications, isLoading, hasUnread, refetch: fetchPreview, markAsReadLocally };
}