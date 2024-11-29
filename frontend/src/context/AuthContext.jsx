import { createContext, useState } from "react";
import Toolbar from "../components/Toolbar";

export const AuthContext = createContext();

export const AuthProvider = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);    // 기본적으로 로그인 상태는 false로 지정

    const login = () => setIsLoggedIn(true);
    const logout = () => setIsLoggedIn(false);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            <Toolbar />
        </AuthContext.Provider>
    );
};