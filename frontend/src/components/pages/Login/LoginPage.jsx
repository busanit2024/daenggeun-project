import React from "react";
import InputText from "../../ui/InputText";


function LoginPage {
    return(
        <Wrapper>
            <Container>
                <LoginBox>
                    <Logo />
                    <div>
                        <h3>로그인 / 회원가입</h3>
                        <InputText 
                            value="phone" 
                            onChange={onChange}
                            />
                    </div>
                </LoginBox>
                
            </Container>
        </Wrapper>

    );
}



export default LoginPage; 