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
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(() => api(originalRequest))
                .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            await api.post("/auth/refresh");
            processQueue(null);
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError);
            onAuthFailure?.();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);