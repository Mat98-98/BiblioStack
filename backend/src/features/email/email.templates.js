export const emailTemplates = {

    passwordReset: ({ firstName, link }) => ({
        subject: "Reimposta la tua password — BiblioStack",
        html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                <h2>Ciao ${firstName ?? ""},</h2>
                <p>Hai richiesto di reimpostare la tua password. Clicca sul link qui sotto per procedere:</p>
                <a href="${link}" style="
                    display: inline-block;
                    margin: 16px 0;
                    padding: 12px 24px;
                    background: #000;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                ">Reimposta password</a>
                <p style="color: #888; font-size: 14px;">
                    Il link scade tra 10 minuti.<br/>
                    Se non hai richiesto tu il reset, ignora questa email.
                </p>
            </div>
        `
    }),

    accountSetup: ({ firstName, link }) => ({
        subject: "Completa la registrazione — BiblioStack",
        html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                <h2>Benvenuto ${firstName ?? ""},</h2>
                <p>Il tuo account è stato creato. Clicca sul link qui sotto per impostare la tua password e completare la registrazione:</p>
                <a href="${link}" style="
                    display: inline-block;
                    margin: 16px 0;
                    padding: 12px 24px;
                    background: #000;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                ">Completa registrazione</a>
                <p style="color: #888; font-size: 14px;">Il link scade tra 24 ore.</p>
            </div>
        `
    }),
}