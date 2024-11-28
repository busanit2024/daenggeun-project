import { Children, createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ Children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);    // 기본적으로 로그인 상태는 false로 지정

    const login = () => setIsLoggedIn(true);
    const logout = () => setIsLoggedIn(false);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {Children}
        </AuthContext.Provider>
    );
};