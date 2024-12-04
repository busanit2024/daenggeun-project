import React , { useState } from "react";
import Logo from "../../ui/Logo";
import InputText from "../../ui/InputText";
import Button from "../../ui/Button";
import styled from "styled-components";
import SearchBox from "../../ui/SearchBox";

const Wrapper = styled.div`
    display : flex;
    flex-direction: column;
    min-height: 100vh;
    padding: 20px;  
    align-items : center;
`;

const Spacing = styled.div`
    margin: 5px 0;
`;

export default function SetProfilePage(props) {
    const [ username, setUsername ] = useState("");

    return (
        <Wrapper>
            <Logo variant="logoWithText"  />
            <h3>우리 동네 중고 직거래</h3>
            <h4>
                당근마켓은 동네 직거래 마켓이에요.<br />
                내 동네를 설정하고 시작해보세요!
            </h4>
            <h3>내 동네 설정하기</h3>
            <SearchBox />

            <h3>프로필 설정하기</h3>

            <InputText 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="닉네임을 입력하세요"  />
            <Spacing /><Spacing />
            <Button
                title="댕근 시작하기"
                onClick={handleButton}
                variant="primary" />
        </Wrapper>
    );

};