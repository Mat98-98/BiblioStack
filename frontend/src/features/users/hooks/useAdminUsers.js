import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "@/api/axios.js";
import { notify } from "@/lib/notify.js";

export function useAdminUsers() {
    const [searchParams, setSearchParams] = useSearchParams()

    const search = searchParams.get("search") ?? "";
    const page   = Number(searchParams.get("page") ?? 1);
    const limit  = Number(searchParams.get("limit") ?? 5);

    const [users, setUsers]     = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);


    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const endpoint = search ? "/users/search" : "/users";
            const res = await api.get(endpoint, { params: { search, page, limit } });
            setUsers(res.data);
            setHasMore(res.data.length === limit);
        } catch {
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [search, page, limit]);

    useEffect(() => { fetchUsers() }, [fetchUsers]);

    const setSearch = (v) => setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        if (v) next.set("search", v);
        else next.delete("search");
        next.set("page", "1");
        return next;
    });

    const setPage = (p) => setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.set("page", String(p));
        return next;
    });

    const createUser = async (data) => {
        try {
            await api.post("/users", data);
            await fetchUsers();
            notify.success("Utente creato");
        } catch {
            notify.error("Errore nella creazione");
        }
    };

    const updateRole = async (userId, role) => {
        try {
            await api.patch(`/users/${userId}/role`, {
                role
            })

            await fetchUsers();
            notify.success("Ruolo aggiornato");
        } catch {
            notify.error("Errore nell'aggiornamento del ruolo");
        }
    };

    const updateUser = async (userId, data) => {
        try {
            await api.patch(`/users/${userId}`, data);
            await fetchUsers();
            notify.success("Utente aggiornato");
        } catch {
            notify.error("Errore nell'aggiornamento");
        }
    }

    const deleteUser = async (userId) => {
        try {
            await api.delete(`/users/${userId}`);
            setUsers(prev => prev.filter(u => u.id !== userId));
            notify.success("Utente eliminato");
        } catch {
            notify.error("Errore nell'eliminazione");
        }
    };

    const suspendUser = async ({ userId, handledBy, reason, endDate }) => {
        try {
            await api.post("/suspensions", { userId, handledBy, reason, endDate });
            notify.success("Utente sospeso");
        } catch {
            notify.error("Errore nella sospensione");
        }
    };

    return {
        users, loading, hasMore, page, search,
        setSearch, setPage,
        createUser, updateRole, updateUser, deleteUser, suspendUser,
    };
}