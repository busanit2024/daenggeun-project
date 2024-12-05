import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "./ui/Button";
import { useNavigate } from "react-router-dom";
import "../styles/Toolbar.css";
import Logo from "./ui/Logo";

const Toolbar = () => {
    const { logout } = useContext(AuthContext);
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);
    const navigate = useNavigate();

    const handleLogoOnClick = () => {
        navigate("/");
    };

    // 로그인 여부를 상태로 저장
    useEffect(()=> {
        const uid = window.sessionStorage.getItem("uid");
        setIsLoggedIn(!!uid);
    }, []);

    const handleLogout = () => {
        window.sessionStorage.removeItem("uid");
        setIsLoggedIn(false);
        logout();
    };
    
    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

    return (
        <div className="toolbar">
            <Logo 
                variant="logoWithText" 
                className="logo"
                onClick={handleLogoOnClick} 
                style={{ cursor: "pointer" }}/>
                <nav>
                    <ul className="nav-links">
                        <li>
                            <a href="/usedTrade/used-trade">중고거래</a>
                        </li>
                        <li>
                            <a href="/alba">알바</a>
                        </li>
                        <li>
                            <a href="/community">동네생활</a>
                        </li>
                        <li>
                            <a href="/group">모임</a>
                        </li>
                        </ul>
                </nav>
                <div className="auth-links">
                    {isLoggedIn ? (
                        <>
                            <button onClick={handleLogout}>로그아웃</button>
                            <a href="/mypage">마이페이지</a>
                        </>
                    ) : (
                        <button onClick={() => navigate("/login")}>로그인 / 회원가입</button>
                    )}
                </div>
        </div>
    );
};

export default Toolbar;