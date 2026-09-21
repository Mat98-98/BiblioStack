import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios.js";
import { notify } from "@/lib/notify.js";
import { handleApiError } from "@/lib/handleApiError.js";

export function useAdminUserDashboard(userId) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchUser = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await api.get(`/users/${userId}/dashboard`);
            setUser(res.data);
        } catch (err) {
            setError(err);
            handleApiError(err, navigate);
        } finally {
            setLoading(false);
        }
    }, [userId, navigate]);

    useEffect(() => { fetchUser() }, [fetchUser]);

    const cancelReservation = async (reservationId) => {
        try {
            await api.patch(`/reservations/${reservationId}`, { status: "cancelled" });
            await fetchUser();
            notify.success("Prenotazione annullata");
            return true;
        } catch {
            notify.error("Errore nell'annullamento");
            return false;
        }
    };

    // Firma compatibile con SuspendUserDialog: onConfirm({ userId, handledBy, reason, endDate })
    const suspendUser = async (payload) => {
        try {
            await api.post("/suspensions", payload);
            await fetchUser();
            notify.success("Utente sospeso");
        } catch (err) {
            notify.error("Errore nella sospensione");
            throw err; // SuspendUserDialog fa handleApiError nel suo catch, quindi rilancio
        }
    };

    const unsuspendUser = async () => {
        try {
            await api.patch(`/suspensions/user/${user.id}/end`);
            await fetchUser();
            notify.success("Sospensione revocata");
        } catch {
            notify.error("Errore nella revoca della sospensione");
        }
    };

    // Firma compatibile con ChangeRoleDialog: onUpdated(userId, role)
    const updateRole = async (targetUserId, role) => {
        try {
            await api.patch(`/users/${targetUserId}/role`, { role });
            await fetchUser();
            notify.success("Ruolo aggiornato");
        } catch (err) {
            notify.error("Errore nell'aggiornamento del ruolo");
            throw err; // ChangeRoleDialog fa handleApiError nel suo catch
        }
    };

    const updateUser = async (data) => {
        try {
            await api.patch(`/users/${user.id}`, data);
            await fetchUser();
            notify.success("Utente aggiornato");
        } catch {
            notify.error("Errore nell'aggiornamento");
        }
    };

    const deleteUser = async () => {
        try {
            await api.patch(`/users/${user.id}/soft-delete`);
            notify.success("Utente eliminato");
            navigate("/admin/users"); // dopo eliminazione non ha senso restare sulla dashboard del singolo utente
        } catch {
            notify.error("Errore nell'eliminazione");
        }
    };

    const deleteLoan = async (loanId) => {
        try {
            await api.delete(`/loans/${loanId}`);
            await fetchUser();
            notify.success("Prestito eliminato");
        } catch {
            notify.error("Errore nell'eliminazione del prestito");
        }
    };

    const createNotice = async (payload) => {
        try {
            await api.post("/notices", payload);
            await fetchUser();
            notify.success("Segnalazione registrata");
        } catch (err) {
            notify.error("Errore nella registrazione della segnalazione");
            throw err; // NoticeDialog fa handleApiError nel suo catch
        }
    };

    return {
        user, loading, error,
        refetch: fetchUser,
        cancelReservation,
        suspendUser, unsuspendUser,
        updateRole, updateUser, deleteUser,
        deleteLoan, createNotice
    };
}