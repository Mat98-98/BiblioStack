import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editUserSchema } from "@/features/admin/users/dialogs/editUserDialog/editUser.schema.js";
import api from "@/api/axios.js";


export function useEditUser(user, open) {
    const [loading, setLoading] = useState(false)

    const form = useForm({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            firstName: "",
            lastName:  "",
            email:     "",
            phone:     "",
        }
    })

    // Fetch dati utente quando si apre il dialog
    useEffect(() => {

        if (!open || !user?.id) {
            return;
        }

        const fetchUser = async () => {
            try {
                const { data } = await api.get(`/users/${user.id}`)

                form.reset({
                    firstName: data.firstName ?? "",
                    lastName:  data.lastName  ?? "",
                    email:     data.email     ?? "",
                    phone:     data.phone     ?? "",
                })
            } catch (error) {}
        }

        fetchUser()
    }, [user?.id, open])

    return { form, loading, setLoading }
}