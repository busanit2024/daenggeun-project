import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 기본적으로 로그인 상태는 false로 지정
    const [currentUserId, setCurrentUserId] = useState(null); // 현재 로그인한 사용자 ID 상태

    const login = (userId) => {
        setIsLoggedIn(true);
        setCurrentUserId(userId); // 로그인 시 사용자 ID 설정
    };

    const logout = () => {
        setIsLoggedIn(false);
        setCurrentUserId(null); // 로그아웃 시 사용자 ID 초기화
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, currentUserId,login, logout }}>
            {children} 
        </AuthContext.Provider>
    );
};