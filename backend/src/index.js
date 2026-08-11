import "dotenv/config";
import express from "express"
import cors from 'cors';
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { startReservationExpiryJob } from "./features/reservationExpiry/reservationExpiry.job.js";
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

const app = express()

const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://urlreale'] // da cambiare in produzione
    : ['http://localhost:5173']; // frontend locale

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // richieste da Postman o server-to-server
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(null, false);
    },
    credentials: true, // necessario per i cookie
}));

app.use(express.json())
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

app.use("/api/deweyCodes", deweyCodeRoutes)

app.use("/api/notices", noticeRoutes)

app.use("/api/suspensions", suspensionRoutes)

app.use("/api/locations", locationRoutes)

app.use("/api/contributions", contributionRoutes)

app.use("/api/genres", genreRoutes)

app.use("/api/languages", languageRoutes)

app.use("/api/publishers", publisherRoutes)

app.use("/api/currencies", currencyRoutes)

app.use(errorMiddleware);


// Lancia il job per verificare la scadenza delle prenotazioni
startReservationExpiryJob();

// Avvio del server
const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

