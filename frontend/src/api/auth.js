import client from "./client";

export const register = (email, password) =>
    client.post("/api/auth/register", { email, password });

export const login = (email, password) =>
    client.post("/api/auth/login", { email, password });

export const logout = () => client.post("/api/auth/logout");