import React from "react";
import styled from "styled-components";
import Navigation from "../navigation/Navigation";

const Wrapper = styled.div`
    max-width: 1400px;
    min-width: 768px; 
    margin: 0 auto; 
    padding: 0 16px;
    
    @media (max-width: 768px) {
        padding: 0 8px; 
    }
`;

const Container = styled.div`
    width:100%;
    max-width:720px;

    :not(:last-child){
        margin-bottom : 16px;
    }
`;

function MainPage(props) {

    return (
        <Wrapper>
            <Container>
                <h1>메인 페이지</h1>
            </Container>
        </Wrapper>
    );
}

export default MainPage ;