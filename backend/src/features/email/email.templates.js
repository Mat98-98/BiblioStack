const BRAND = {
    bg: "#f8f8fa",
    card: "#ffffff",
    foreground: "#0a0b0f",
    mutedForeground: "#535461",
    primary: "#614afc",
    primaryForeground: "#ffffff",
    border: "#dcdde8",
    success: "#009056",
    warning: "#e88100",
    destructive: "#e62b34",
};

// Wrapper HTML condiviso: stesso stile (card arrotondata, font, bottone) per tutte le email
const layout = ({ heading, bodyHtml, ctaText, ctaLink, accent = BRAND.primary }) => `
    <div style="background:${BRAND.bg}; padding: 32px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 480px; margin: 0 auto; background:${BRAND.card}; border:1px solid ${BRAND.border}; border-radius:16px; padding: 32px;">
            <div style="font-size: 13px; font-weight: 700; letter-spacing: 0.02em; color:${accent}; text-transform: uppercase; margin-bottom: 8px;">
                BiblioStack
            </div>
            <h2 style="font-size: 20px; font-weight: 700; color:${BRAND.foreground}; margin: 0 0 16px;">${heading}</h2>
            <div style="font-size: 15px; line-height: 1.6; color:${BRAND.foreground};">${bodyHtml}</div>
            ${ctaText && ctaLink ? `
            <a href="${ctaLink}" style="
                display: inline-block;
                margin-top: 24px;
                padding: 12px 24px;
                background: ${accent};
                color: ${BRAND.primaryForeground};
                text-decoration: none;
                border-radius: 12px;
                font-weight: 600;
                font-size: 14px;
            ">${ctaText}</a>` : ""}
            <p style="color:${BRAND.mutedForeground}; font-size: 13px; margin-top: 32px; border-top: 1px solid ${BRAND.border}; padding-top: 16px;">
                BiblioStack — Biblioteca scolastica
            </p>
        </div>
    </div>
`;

export const emailTemplates = {
    layout,

    passwordReset: ({ firstName, link }) => ({
        subject: "Reimposta la tua password — BiblioStack",
        html: layout({
            heading: `Ciao ${firstName ?? ""},`,
            bodyHtml: `<p>Hai richiesto di reimpostare la tua password. Il link scade tra 10 minuti.<br/>Se non hai richiesto tu il reset, ignora questa email.</p>`,
            ctaText: "Reimposta password",
            ctaLink: link,
        })
    }),

    accountSetup: ({ firstName, link }) => ({
        subject: "Completa la registrazione — BiblioStack",
        html: layout({
            heading: `Benvenuto ${firstName ?? ""},`,
            bodyHtml: `<p>Il tuo account è stato creato. Clicca qui sotto per impostare la password e completare la registrazione. Il link scade tra 24 ore.</p>`,
            ctaText: "Completa registrazione",
            ctaLink: link,
        })
    }),
}