import { z } from 'zod';

export const ForgotPasswordSchema = z.object({
    email:     z.email("Invalid email format").trim().toLowerCase(),
})

export const ResetPasswordSchema = z.object({
    token: z.string().min(32, "Invalid token"),
    password:  z.string()
        .min(8,  "Password must be at least 8 characters")
        .max(64, "Password must be at most 64 characters")
        .regex(/[a-z]/,                    "Password must contain a lowercase letter")
        .regex(/[A-Z]/,                    "Password must contain an uppercase letter")
        .regex(/[0-9]/,                    "Password must contain a number")
        .regex(/[^a-zA-Z0-9]/,  "Password must contain a special character")
})