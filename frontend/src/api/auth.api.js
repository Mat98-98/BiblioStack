import api from "@/api/axios.js";


export const login = async (email, password) => {

    const response = await api.post("/auth/login", {
        email,
        password
    });

    return response.data;
}

export const logout = () => {
    return api.post("/auth/logout");
}

export const me = () => {
    return api.get("/auth/me");
}