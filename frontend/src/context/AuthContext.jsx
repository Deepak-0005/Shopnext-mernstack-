import React, { createContext, useEffect, useState } from "react";
import store from "../redux/store";
import { syncCartForUser } from "../redux/cartSlice";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("userInfo");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        store.dispatch(syncCartForUser(user));
    }, [user]);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("userInfo", JSON.stringify(userData));
        store.dispatch(syncCartForUser(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("userInfo");
        store.dispatch(syncCartForUser(null));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};