import React from "react";
import Button from "../ui/Button";
import styled from "styled-components";

const NavBar = styled.nav`
    position: fixed;
    width:calc(100% - 10px);
    top: 0;
    left: 0;
    right: 0;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    z-index: 1000;
`;

const NavItems = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    flex-grow: 1;
    justify-content: flex-start; 
    max-width: 720px;
    margin: 0 auto; 
    justify-content: space-between; 
`;

const Logo = styled.img`
    width : 28px;
    height: 28px;
    margin-right: 16px;
    
`;

const CenterItems = styled.div`
    display: flex;
    align-items: center;
    gap: 30px;
`;

function Navigation () {
    const onClick = () => {
        console.log("버튼 클릭됨");
    }

    return(
        <NavBar>
            <NavItems>
                <Logo src="/carrot_logo.png" alt="로고" />
                <CenterItems>
                    <div>중고거래</div>
                    <div>알바</div>
                    <div>동네업체</div>
                    <div>동네생활</div>
                    <div>모임</div>
                </CenterItems>
                <Button
                    title="로그인"
                    variant="login"
                    onClick={onClick}
                />
            </NavItems>
        </NavBar>
    );
}

export default Navigation;