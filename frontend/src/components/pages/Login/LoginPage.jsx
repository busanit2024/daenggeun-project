import React from "react";
import InputText from "../../ui/InputText";


function LoginPage {
    return(
        <Wrapper>
            <Container>
                <LoginBox>
                    <Logo />
                        <h3>로그인 / 회원가입</h3>
                        <InputText 
                            value="phone" 
                            onChange={onChange}
                            placeholder="휴대폰 번호('-' 없이 숫자만 입력)"/>
                        <Button title="인증문자 받기" 
                        />        

                </LoginBox>
                
            </Container>
        </Wrapper>

    );
}



export default LoginPage; 