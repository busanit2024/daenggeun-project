import React, { useState } from "react";
import InputText from "../../ui/InputText";
import Button from "../../ui/Button";
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

const PhoneErrorMsg = styled.div`
    color : red;
    font-size: 14px;
    margin-top: 3px;
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
    const [errorMessage, setErrorMessage] = useState("");

    const onChangePhone = (e) => {
        const inputPhone = e.target.value;
        setPhone(inputPhone);

        if(inputPhone.length !== 11){
            setErrorMessage("휴대폰 번호를 확인해주세요.");
            return;
        } else {
            setErrorMessage("");
        }

    };


    const requestVerificationCode = () => {
        const appVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
        signInWithPhoneNumber(auth, phone, appVerifier)
            .then((confirmationResult) => {
                setConfirmationResult(confirmationResult);
                setIsCodeSent(true);
                setErrorMessage("");
            })
            .catch((error) => {
                setErrorMessage("인증문자 전송 실패: " + error.message);
            });
    };

    const verifyCode = async () => {
        confirmationResult.confirm(verificationCode)
            .then(async (result) => {
                const user = result.user;
                const uid = user.uid;
    
                // MongoDB에서 전화번호 확인
                const existingUserResponse = await fetch(`/api/users/find?phone=${phone}`);
                const existingUser = await existingUserResponse.json();
    
                if (existingUser) {
                    // 로그인 처리
                    console.log("로그인 성공:", existingUser);
                } else {
                    // 새로운 사용자 추가
                    let uniqueCode;
                    let isUnique = false;
    
                    // 유니크 코드 생성 및 중복 확인
                    while (!isUnique) {
                        uniqueCode = generateUniqueCode();
                        const response = await fetch(`/api/users/check-unique-code?code=${uniqueCode}`);
                        isUnique = await response.json();
    
                        if (!isUnique) {
                            console.log("유니크 코드 중복, 다시 생성합니다.");
                        }
                    }
    
                    // 유니크 코드가 중복되지 않으면 사용자 등록
                    const newUser = await fetch('/api/users/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ phone, uid, uniqueCode }), // uniqueCode 추가
                    });
                    console.log("회원가입 성공:", newUser);
                }
            })
            .catch((error) => {
                setErrorMessage("인증 코드가 잘못되었습니다: " + error.message);
            });
    };


    return (
        <>
            <Wrapper>
                <LoginBox>
                    <Logo variant="logoWithText"  />
                    <h3>로그인 / 회원가입</h3>
                    <InputText 
                        value={phone}
                        onChange={onChangePhone}
                        placeholder="휴대폰 번호('-' 없이 숫자만 입력)"/>
                    <Spacing />
                    {errorMessage && <PhoneErrorMsg>{errorMessage}</PhoneErrorMsg>}
                    {!isCodeSent ? (
                        <Button title="인증문자 받기" variant="white" onClick={requestVerificationCode} />
                    ) : (
                        <>
                            <InputText 
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder="인증 코드를 입력하세요"/>
                            <Button title="인증하기" variant="white" onClick={verifyCode} />
                        </>
                    )}
                    <Spacing />
                    <StyledMsg>
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