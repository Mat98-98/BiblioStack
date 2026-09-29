import { z } from 'zod';

// Schema di validazione dei dati inviati dal form di registrazione utente
export const RegisterSchema = z.object({
    firstName: z.string().trim().min(1).max(50).optional(),
    lastName:  z.string().trim().min(1).max(50).optional(),
    phone:     z.string().trim().regex(/^\+?[0-9\s\-]{7,15}$/).optional(),
    email:     z.email("Invalid email format").trim().toLowerCase(),
    password:  z.string()
        .min(8,  "Password must be at least 8 characters")
        .max(128, "Password must be at most 128 characters")
        .regex(/[a-z]/,                    "Password must contain a lowercase letter")
        .regex(/[A-Z]/,                    "Password must contain an uppercase letter")
        .regex(/[0-9]/,                    "Password must contain a number")
        .regex(/[^a-zA-Z0-9]/,  "Password must contain a special character")
});


// Normalizzazione e limitazione lunghezza email con seguente validazione del formato (pipe controlla dopo la normalizzazione)
const loginEmailField = z.string().trim().toLowerCase().max(254).pipe(z.email("Invalid email format"));
// Schema di validazione dei dati inviati dal form di login
export const LoginSchema = z.object({
    email:    loginEmailField,
    password: z.string().min(1, "Password is required").max(128),
});

// Schema di validazione per il login Google
export const GoogleLoginSchema = z.object({
    idToken:     z.string().min(1, "ID token is required")
});