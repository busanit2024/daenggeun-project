import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import styled from "styled-components";
import "./ui/Button";
import { useNavigate } from "react-router-dom";
import "../styles/Toolbar.css";

const Toolbar = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);
    const navigate = useNavigate();
    
    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

    return (
        <div className="toolbar">
            <img 
                src="/images/logo.png" 
                alt="로고" 
                className="logo"
                onClick={() => navigate("/")} 
                style={{ cursor: "pointer" }}/>
                <nav>
                    <ul className="nav-links">
                        <li>
                            <a href="/pages/used-trade">중고거래</a>
                        </li>
                        <li
                        className="dropdown"
                        onMouseEnter={toggleDropdown}
                        onMouseLeave={toggleDropdown}
                        >
                        <a href="/">알바</a>
                        {isDropdownOpen && (
                        <ul className="dropdown-menu">
                            <li>
                            <a href="/">알바 검색</a>
                            </li>
                            <li>
                            <a href="/">당근알바 소개</a>
                            </li>
                            <li>
                            <a href="/">기업형 서비스</a>
                            </li>
                            <li>
                            <a href="/">신뢰와 안전</a>
                            </li>
                        </ul>
                        )}
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
                        <button onClick={logout}>로그아웃</button>
                        <a href="/mypage">마이페이지</a>
                    </>
                    ) : (
                    <a href="/login">로그인 / 회원가입</a>
                    )}
                </div>
        </div>
    );
};

export default Toolbar;