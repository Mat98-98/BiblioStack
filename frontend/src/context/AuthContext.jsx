import { createContext, useContext, useEffect, useState } from "react"
import api from "@/api/axios"

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchMe = async () => {
        try {
            const res = await api.get("/auth/me");
            setUser(res.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMe()
    }, [])

    const login = async (email, password) => {
        try {
            await api.post("/auth/login", { email, password });
            await fetchMe();
        } catch (err) {
            setUser(null);
            throw err; // rilancia per gestirlo nel componente
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            loading,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}