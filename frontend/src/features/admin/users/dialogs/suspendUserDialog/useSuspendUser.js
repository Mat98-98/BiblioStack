import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { suspendUserSchema } from "@/features/admin/users/dialogs/suspendUserDialog/suspendUser.schema.js";


export function useSuspendUser(user, admin) {
    const [loading, setLoading] = useState(false)

    const form = useForm({
        resolver: zodResolver(suspendUserSchema),
        defaultValues: {
            reason: "",
            endDate: "",
        }
    })

    return { form, loading, setLoading }
}