import React from "react";
import styled from "styled-components";
import Button from "../../ui/Button";
import Card from "../../ui/Card";
import { useNavigate } from "react-router-dom";
import FilterBar from "../../ui/FilterBar";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  padding: 2vw;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  padding: 2vw; /* 화면 크기에 따라 여백 자동 조정 */
  gap: 1vw;
  width: 100%;

  /* Flexbox 동적 레이아웃 */
  @media (max-width: 768px) {
    flex-direction: column; /* 화면이 작아질수록 세로 배치 */
  }
`;

const Sidebar = styled.aside`
  flex: 0 0 20%; /* 가로폭의 20% 차지 */
  max-width: 250px; /* 최대 너비 제한 */
  min-width: 150px; /* 최소 너비 제한 */

  @media (max-width: 768px) {
    flex: 0 0 auto;
    width: 100%; /* 작은 화면에서는 전체 너비 */
    margin-bottom: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Main = styled.main`
  flex: 1; /* 남은 공간을 차지 */
`;

const Title = styled.h1`
  font-size: clamp(16px, 2vw, 24px); /* 최소 16px, 최대 24px */
  margin-bottom: 16px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(clamp(100px, 20vw, 250px), 1fr));
  gap: 1vw;
  width: 100%;
`;

const UsedTrade = () => {
    const navigate = useNavigate();  // useNavigate 훅 사용

    return (
        <Container>
            <Content>
                <Sidebar>
                    <FilterBar />
                </Sidebar>
                <Main>
                  <Header>
                    <Title>부산광역시 동래구 중고거래</Title>
                    <Button
                      title="+ 글쓰기"
                      variant="primary"
                      onClick={() => navigate("/usedTrade/used-trade-write")}
                    />
                  </Header>
                  <CardGrid>
                    {Array.from({ length: 20 }).map((_, index) => (
                      <Card 
                        key={index} 
                        title={`상품 ${index + 1}`} 
                        location="동래구"
                        onClick={() => navigate(`/UsedTrade/used-trade-view/${index + 1}`)}  // 클릭 시 해당 상세페이지로 이동
                        style={{ cursor: "pointer" }}
                     />
                   ))}
                  </CardGrid>
                </Main>
            </Content>
        </Container>
    );
};

export default UsedTrade;
