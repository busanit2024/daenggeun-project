import React, { useEffect, useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../../firebase.js";
import InputText from "../../ui/InputText";
import Button from "../../ui/Button";
import Logo from "../../ui/Logo";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useGetUserId from "../../../utils/useGetUserId"; 

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
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [value, setValue] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const sessionUid = window.sessionStorage.getItem("uid");
    const [uid, setUid] = useState(sessionUid || "");
    const userId = useGetUserId(uid);

    // uid 동기화
    useEffect(() => {
        if(uid){
            window.sessionStorage.setItem("uid",uid);
        } else {
            window.sessionStorage.removeItem("uid");
        }
    }, [uid]);
    
    const onChangePhone = (e) => {
        const inputPhone = e.target.value;
        setPhone(inputPhone);
    };

    const requestVerificationCode = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
          size: "invisible",  // "invisible"에서 "visible"로 변경
          callback: (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            console.log("reCAPTCHA solved");
          },
        }, auth);
        auth.languageCode = "ko";		

        const appVerifier = window.recaptchaVerifier;
        console.log(auth);
        console.log(phone);
        console.log(appVerifier);
        signInWithPhoneNumber(auth, phone, appVerifier)
          .then((confirmationResult) => {
            setIsCodeSent(true);
            console.log("signInWithPhoneNumber 결과: ", confirmationResult);
            window.confirmationResult = confirmationResult;	// window
        })
          .catch((error) => {
            console.log("SMS FAILED");
            console.error("Error during confirmation:", error);
        });
    };

    const generateUniqueCode = () => {
        const randomNumber = Math.floor(100000 + Math.random() * 900000); 
        return `${randomNumber}`;
    };

    const verifyCode = async () => {
        try {
            const code = value;
            const result = await window.confirmationResult.confirm(code);
            const user = result.user;

            console.log("인증 성공:", user);

            // Firebase ID 토큰 가져오기
            const idToken = await user.getIdToken();
    
            // DB에서 전화번호 확인
            const existingUserResponse = await axios.get(`/user/find/${phone}`, {
                headers: {
                    Authorization:`Bearer ${idToken}`,
                },
            });
            const existingUser = existingUserResponse.data;
    
            if (existingUser) {
                // 기존 사용자 로그인 처리
                console.log("로그인 성공:", existingUser);

                setUid(user.uid);

                navigate("/"); // 기존 사용자 로그인 후 홈으로 이동
            } else {
                // 새로운 사용자 추가
                let uniqueCode;
                let isUnique = false;
    
                // 유니크 코드 생성 및 중복 확인
                while (!isUnique) {
                    uniqueCode = generateUniqueCode();
                    const checkResponse = await axios.get(`/user/checkUniqueCode/${uniqueCode}`, {
                        headers: {
                            Authorization:`Bearer ${idToken}`,
                        },
                    });            
                    
                    if (checkResponse.data && checkResponse.data.exists !== undefined) {
                        isUnique = !checkResponse.data.exists; 
                    } else {
                        console.error("API 응답이 예상과 다릅니다:", checkResponse.data);
                        break;
                    }
                }
    
                if (isUnique) {
                    await axios.post("/user/join", {
                        phone,
                        uid: user.uid,
                        uniqueCode,
                        mannerTemp : 36.5
                    },
                    {
                        headers : {
                            Authorization:`Bearer ${idToken}`,
                        },
                    });
    
                    console.log("회원가입 성공");

                    setUid(user.uid); // uid 설정

                    navigate(`/setProfile/${userId}`); // userId로 프로필 설정 페이지로 이동
                } else {
                    console.error("유니크 코드 중복 확인에서 오류 발생");
                }
            }
    
        } catch (error) {
            // 인증 실패 처리
            console.error("인증 실패:", error);
            setErrorMessage("인증에 실패했습니다. 다시 시도해주세요.");
        }
    };    

    return (
        <Wrapper>
            <LoginBox>
                <Logo variant="logoWithText"  />
                <h3>로그인 / 회원가입</h3>
                <div id="sign-in-button"></div>
                <InputText 
                    value={phone}
                    onChange={onChangePhone}
                    placeholder="휴대폰 번호(+82 10 1234 5678 형식으로 '-' 없이 입력)"
                />
                <Spacing />
                {errorMessage && <PhoneErrorMsg>{errorMessage}</PhoneErrorMsg>}
                {!isCodeSent ? (
                    <Button title="인증문자 받기" variant="white" onClick={requestVerificationCode} />
                ) : (
                    <>
                        <InputText 
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="인증 코드를 입력하세요"
                        />
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
    );
}

export default LoginPage;