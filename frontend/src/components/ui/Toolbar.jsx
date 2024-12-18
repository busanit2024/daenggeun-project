import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Button";
import { useNavigate } from "react-router-dom";
import "../../styles/Toolbar.css";
import Logo from "./Logo";
import Button from "./Button";

const Toolbar = ({ scrolled }) => {
    const { logout } = useContext(AuthContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleLogoOnClick = () => {
        navigate("/");
    };

    // 로그인 여부를 상태로 저장
    useEffect(() => {
        const uid = window.sessionStorage.getItem("uid");
        setIsLoggedIn(!!uid);
    }, []);

    const handleLogout = () => {
        window.sessionStorage.removeItem("uid");
        setIsLoggedIn(false);
        logout();
    };

    const handleNavigation = (path, category) => {
        navigate(`${path}`, {
            state: {
                fromToolbar: true,
                category: category
            }
        });
    };

    return (
        <div className="toolbar" style={ { borderBottom: `1px solid ${scrolled ? '#e7e7e7' : 'transparent'}` }}>
            <div className="logo">
                <Logo
                    variant="logoWithText"
                    className="logo"
                    onClick={handleLogoOnClick}
                    style={{ cursor: "pointer" }} />
            </div>
            <nav>
                <ul className="nav-links">
                    <li>
                        <a onClick={() => handleNavigation('/usedTrade', '중고거래')}
                            style={{ cursor: 'pointer' }}>중고거래</a>
                    </li>
                    <li>
                        <a onClick={() => handleNavigation('/alba', '알바')}
                            style={{ cursor: 'pointer' }}>알바</a>
                    </li>
                    <li>
                        <a onClick={() => handleNavigation('/community', '동네생활')}
                            style={{ cursor: 'pointer' }}>동네생활</a>
                    </li>
                    <li>
                    <a onClick={() => handleNavigation('/group', '모임')}
                            style={{ cursor: 'pointer' }}>모임</a>
                    </li>
                </ul>
            </nav>
            <div className="auth-links">
                {isLoggedIn ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Button title="로그아웃" onClick={handleLogout} />
                        <Button title="마이페이지" variant="login" onClick={() => navigate("/mypage")} />
                    </div>
                ) : (
                    <Button title="로그인/회원가입" variant="login" onClick={() => navigate("/login")}>로그인 / 회원가입</Button>
                )}
            </div>
        </div>
    );
};

export default Toolbar;