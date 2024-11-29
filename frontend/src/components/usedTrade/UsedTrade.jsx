import React from "react";
import styled from "styled-components";
import Button from "../ui/Button";
import Filter from "../ui/Filter";
import Card from "../ui/Card";
import { useNavigate } from "react-router-dom";

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

// 숫자에 쉼표 추가하기
const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR").format(price);
};

const UsedTrade = () => {
    const navigate = useNavigate();

    const products = Array.from({ length: 20 }).map((_, index) => ({
        id: index + 1,
        title: `쓸모가 없어진 물건 팝니다 ${index + 1}`,
        location: "동래구",
        price: `${formatPrice((index + 1) * 10000)} 원`,  // 가격 나중에 수정
    }));

    return (
        <Container>
            <Content>
                <Sidebar>
                    <Filter />
                </Sidebar>
                <Main>
                    <Title>부산광역시 동래구 중고거래</Title>
                    <CardGrid>
                        {products.map((product) => (
                            <Card
                                key={product.id}
                                title={product.title}
                                location={product.location}
                                price={product.price}
                                onClick={() => navigate(`/usedTrade/used-trade-view/${product.id}`, {
                                    state: product, // 상품 정보를 state로 넘기기
                                })}
                            />
                        ))}
                    </CardGrid>
                </Main>
            </Content>
        </Container>
    );
};

export default UsedTrade;
