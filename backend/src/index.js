import "dotenv/config";
import express from "express"
import cors from 'cors';
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { startReservationExpiryJob } from "./features/reservationExpiry/reservationExpiry.job.js";
import { pinoHttp } from "pino-http";
import { startReservationReminderJob } from "./features/reservationExpiry/reservationReminder.job.js";
import { startLoanExpiryJob } from "./features/loanExpiry/loanExpiry.job.js";
import { logger } from "./config/logger.config.js";
import { redis } from "./redis/connection.js";
import authorRoutes from "./routes/author.routes.js";
import itemRoutes from './routes/item.routes.js';
import reservationRoutes from "./routes/reservation.routes.js";
import loanRoutes from "./routes/loan.routes.js";
import workRoutes from "./routes/work.routes.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import accessRoutes from "./routes/access.routes.js";
import roleRoutes from "./routes/role.routes.js";
import worksExternalRoutes from "./features/worksExternal/worksExternal.routes.js";
import deweyCodeRoutes from "./routes/dewey.code.routes.js";
import noticeRoutes from "./routes/notice.routes.js";
import suspensionRoutes from "./routes/suspension.routes.js";
import locationRoutes from "./routes/location.routes.js";
import contributionRoutes from "./routes/contribution.routes.js";
import genreRoutes from "./routes/genre.routes.js";
import languageRoutes from "./routes/language.routes.js";
import publisherRoutes from "./routes/publisher.routes.js";
import currencyRoutes from "./routes/currency.routes.js";
import cardRoutes from "./routes/card.routes.js";
import publicationCountriesRoutes from "./routes/publication.countries.routes.js";
import noticeTypesRoutes from "./routes/notice.types.routes.js";
import operatorDashboardRoutes from "./features/operatorDashboard/operator.dashboard.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

const app = express()

// Configura il numero di reverse proxy fidati per permettere a Express di determinare correttamente l'IP reale del client tramite gli header X-Forwarded-For. Deve corrispomdere alla reale topologia di rete
const trustProxyHops = process.env.NODE_ENV === "production"
    ? Number(process.env.TRUST_PROXY_HOPS ?? 0)
    : 1;
app.set("trust proxy", trustProxyHops);

// Origini autorizzate a effettuare richieste cross-origin
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://urlreale'] // da cambiare in produzione
    : [process.env.FRONTEND_URL]; // frontend locale

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // Consente richieste da Postman o server-to-server
        if (allowedOrigins.includes(origin)) return callback(null, true); // Consente esclusivamente le origini presenti nella allowList
        return callback(null, false);
    },
    credentials: true, // necessario per permettere al browser di inviare cookie nelle richieste cross-origin
}));

app.use(pinoHttp({ logger }));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/api/authors", authorRoutes)

app.use("/api/items", itemRoutes)

app.use("/api/reservations", reservationRoutes)

app.use("/api/loans", loanRoutes)

app.use("/api/works", workRoutes)

app.use("/api/users", userRoutes)

app.use("/api/auth", authRoutes)

app.use("/api/access", accessRoutes)

app.use("/api/roles", roleRoutes)

app.use("/api/works-external", worksExternalRoutes)

app.use("/api/dewey-codes", deweyCodeRoutes)

app.use("/api/notices", noticeRoutes)

app.use("/api/suspensions", suspensionRoutes)

app.use("/api/locations", locationRoutes)

app.use("/api/contributions", contributionRoutes)

app.use("/api/genres", genreRoutes)

app.use("/api/languages", languageRoutes)

app.use("/api/publishers", publisherRoutes)

app.use("/api/currencies", currencyRoutes)

app.use("/api/publication-countries", publicationCountriesRoutes)

app.use("/api/cards", cardRoutes)

app.use("/api/notice-types", noticeTypesRoutes)

app.use("/api/operator-dashboard", operatorDashboardRoutes)

app.use("/api/notifications", notificationRoutes)

app.use(errorMiddleware);



// Avvio backend
const PORT = process.env.PORT || 5001;
const startServer = async () => {
    try {
        // Connessione a Redis
        await redis.connect();
        logger.info({ ready: redis.isReady }, "Redis connected successfully");

        // Lancio il job per verificare la scadenza delle prenotazioni
        startReservationExpiryJob();

        // Lancio il job per processare e inviare le notifiche automatiche sulle prenotazioni in scadenza
        startReservationReminderJob();

        // Lancio il job per processare i prestiti scaduti o in scadenza
        startLoanExpiryJob();

        // Avvio del server
        app.listen(PORT, () => {
            logger.info({ port: PORT }, "Server is running");
        });
    } catch (error) {
        logger.fatal({ err: error }, "Failed to start server");
        process.exit(1);
    }
};

startServer();

