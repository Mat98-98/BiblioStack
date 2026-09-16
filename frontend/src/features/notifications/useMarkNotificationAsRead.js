import { useState } from "react";
import api from "@/api/axios.js";
import { handleApiError } from "@/lib/handleApiError.js";

export function useMarkNotificationAsRead() {
    const [isLoading, setIsLoading] = useState(false);

    const markAsRead = async (id) => {
        setIsLoading(true);
        try {
            const { data } = await api.patch(`/notifications/${id}/read`);
            return data;
        } catch (error) {
            handleApiError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { markAsRead, isLoading };
}