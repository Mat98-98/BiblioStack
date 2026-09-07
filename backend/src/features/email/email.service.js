import { Resend } from "resend"
import { emailTemplates } from "./email.templates.js"
import { logger } from "../../config/logger.config.js"

const isProduction = process.env.NODE_ENV === "production"
const resendApiKey = process.env.RESEND_API_KEY

if (isProduction && !resendApiKey) {
    logger.error("RESEND_API_KEY is missing in production environment")
}

const resend = isProduction && resendApiKey
    ? new Resend(resendApiKey)
    : null

const FROM = "BiblioStack <onboarding@resend.dev>"

export const BASE_URL =
    process.env.FRONTEND_URL ?? "http://localhost:5173"

const send = async ({ to, subject, html, type }) => {
    if (!resend) {
        logger.debug(
            { type },
            "Email skipped: Resend is not configured"
        )
        return
    }

    try {
        await resend.emails.send({
            from: FROM,
            to,
            subject,
            html
        })
    } catch (error) {
        logger.error(
            { err: error, type },
            "Failed to send email"
        )
        throw error
    }
}

export const emailService = {

    sendPasswordReset: async ({ to, firstName, token }) => {
        const link = `${BASE_URL}/reset-password?token=${token}`

        const { subject, html } =
            emailTemplates.passwordReset({
                firstName,
                link
            })

        await send({
            to,
            subject,
            html,
            type: "password_reset"
        })
    },

    sendAccountSetup: async ({ to, firstName, token }) => {
        const link = `${BASE_URL}/setup-account?token=${token}`

        const { subject, html } =
            emailTemplates.accountSetup({
                firstName,
                link
            })

        await send({
            to,
            subject,
            html,
            type: "account_setup"
        })
    },

    // Usata dal notifier per gli eventi generici (prenotazioni, prestiti...)
    sendGeneric: async ({ to, subject, html }) => {
        await send({
            to,
            subject,
            html,
            type: "generic"
        })
    },
}