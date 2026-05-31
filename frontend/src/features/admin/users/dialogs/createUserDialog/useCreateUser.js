import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "@/features/admin/users/dialogs/createUserDialog/createUser.schema.js";


export function useCreateUser() {
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            firstName: "",
            lastName:  "",
            email:     "",
            phone:     "",
            password:  ""
        }
    });

    return { form, loading, setLoading };
}