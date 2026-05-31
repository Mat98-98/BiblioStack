import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeRoleSchema } from "./changeRole.schema";

export function useChangeRole(user, onSuccess) {
    const form = useForm({
        resolver: zodResolver(changeRoleSchema),
        values: {
            role: user?.role?.name
        }
    })

    const { handleSubmit, watch, setValue } = form

    const role = watch("role")

    const submit = handleSubmit(async (data) => {
        if (!user?.id) return

        // Passa l'id e il ruolo direttamente alla funzione genitore (updateRole)
        // L'API e le notifiche verranno gestite da useAdminUsers.js
        if (onSuccess) {
            await onSuccess(user.id, data.role);
        }
    })

    return { form, role, setValue, submit }
}