import api from "@/api/axios.js";

// Callback registrato da AuthContext per essere avvisato quando anche il refresh fallisce (serve fare logout "forzato")
let onAuthFailure = null;
export const registerAuthFailureHandler = (handler) => {
    onAuthFailure = handler;
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve();
    });
    failedQueue = [];
};

// Il refresh passa da un lock condiviso tra tutte le tab (Web Locks API): le tab fanno il refresh
// una alla volta e la seconda parte con il cookie già aggiornato dalla prima. Senza questo, due tab
// che rinnovano insieme userebbero lo stesso refresh token (monouso) e una delle due verrebbe disconnessa.
// Se il browser non supporta i Web Locks si fa il refresh diretto.
const requestRefresh = () =>
    typeof navigator !== "undefined" && navigator.locks
        ? navigator.locks.request("auth-refresh", () => api.post("/auth/refresh"))
        : api.post("/auth/refresh");

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status !== 401 ||
            originalRequest._retry ||
            originalRequest.url === "/auth/refresh"
        ) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            originalRequest._retry = true;

            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => api(originalRequest));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            await requestRefresh();
            processQueue(null);
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError);

            // Logout forzato solo se il server ha rifiutato il token (401).
            // Con Redis/DB giù (5xx) o rete assente la sessione non è invalidata.
            if (refreshError.response?.status === 401) {
                onAuthFailure?.();
            }
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);