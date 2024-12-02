import React, { useState } from "react";
import InputText from "../../ui/InputText";
import Button from "../../ui/Button";
import Toolbar from "../../Toolbar";
import Logo from "../../ui/Logo";
import styled from "styled-components";

const Wrapper = styled.div`
    display : flex;
    flex-direction: column;
    min-height: 100vh;
    padding: 20px;  
    align-items : center;
`;

const LoginBox = styled.div`
    width:40%;
    height : auto;
    display :flex;
    flex-direction : column;
    margin : 20px;
    padding : 20px;
`;

const Spacing = styled.div`
    margin: 5px 0;
`;

const StyledMsg = styled.div`
    text-align : center;
    font-size : 14px;
    margin:0 ;
`;

const StyledLink = styled.a`
    color :black;
    font-weight: bold;
`;

function LoginPage() {
    const [phone, setPhone] = useState("");

    const onChange = (e) => {
        setPhone(e.target.value);
    };

    return (
        <>
            <Wrapper>
                <LoginBox>
                    <Logo variant="logoWithText"  />
                    <h3>로그인 / 회원가입</h3>
                    <InputText 
                        value={phone}
                        onChange={onChange}
                        placeholder="휴대폰 번호('-' 없이 숫자만 입력)"/>
                    <Spacing />
                    <Button title="인증문자 받기" variant="white" />
                    <Spacing />
                    <StyledMsg >
                        휴대폰 번호가 변경되었나요? 
                        <StyledLink
                            href="/find-account" style={{ fontWeight: 'bold' }}> 이메일로 계정 찾기    
                        </StyledLink>
                    </StyledMsg>
                    <Spacing /><Spacing />                  
                    <Button title="기업회원 로그인" variant="white" />                          
                </LoginBox>
            </Wrapper>
        </>
    );
}



export default LoginPage; 