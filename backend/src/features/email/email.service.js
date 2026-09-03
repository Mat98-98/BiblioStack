import { Resend } from "resend"
import { emailTemplates } from "./email.templates.js"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = "BiblioStack <onboarding@resend.dev>"
export const BASE_URL = process.env.FRONTEND_URL ?? "http://localhost:5173"

export const emailService = {

    sendPasswordReset: async ({ to, firstName, token }) => {
        const link = `${BASE_URL}/reset-password?token=${token}`
        const { subject, html } = emailTemplates.passwordReset({ firstName, link })
        await resend.emails.send({ from: FROM, to, subject, html })
    },

    sendAccountSetup: async ({ to, firstName, token }) => {
        const link = `${BASE_URL}/setup-account?token=${token}`
        const { subject, html } = emailTemplates.accountSetup({ firstName, link })
        await resend.emails.send({ from: FROM, to, subject, html })
    },

    // Usata dal notifier per gli eventi generici (prenotazioni, prestiti...)
    sendGeneric: async ({ to, subject, html }) => {
        await resend.emails.send({ from: FROM, to, subject, html })
    },
}