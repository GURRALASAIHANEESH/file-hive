// Backend must expose GET /api/auth/me that returns { _id, email } of the logged-in user based on the JWT cookie.

import { createContext, useContext, useState, useEffect } from "react";
import client from "../api/client";
import { login as apiLogin, logout as apiLogout } from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client
            .get("/api/auth/me")
            .then((res) => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (email, password) => {
        await apiLogin(email, password);
        const res = await client.get("/api/auth/me");
        setUser(res.data);
    };

    const logout = async () => {
        await apiLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}