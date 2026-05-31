import { notify } from "@/lib/notify";

export function handleApiError(error, navigate) {
    const data = error.response?.data

    if (!data) {
        notify.error("Server non raggiungibile")
        return
    }

    switch (data.code) {

        case "VALIDATION_ERROR":
            notify.error(data.details?.[0]?.message || "Errore di validazione")
            break

        case "INVALID_CREDENTIALS":
            notify.error("Email o password errata")
            break

        case "NO_TOKEN":
        case "INVALID_TOKEN":
            notify.error("Sessione scaduta")
            navigate?.("/login")
            break

        default:
            notify.error(data.message || "Errore server")
    }
}