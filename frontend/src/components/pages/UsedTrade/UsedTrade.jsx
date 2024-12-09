import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../../ui/Card";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../ui/Button";
import SearchBar from "../../ui/SearchBar";

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
  const location = useLocation(); // URL에서 query 가져오기
  const [trades, setTrades] = useState([]); // 중고거래 목록 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await fetch('/api/usedTrades');
        const data = await response.json();
        setTrades(data);  // 중고거래 목록 업데이트

        const query = new URLSearchParams(location.search);
        const search = query.get('search');
        if (search) {
            setSearchTerm(search); // URL에서 검색어 가져오기
        } 
      } catch (error) {
        console.error('Error fetching trades:', error);
      }
    };

    fetchTrades();  // 컴포넌트가 마운트될 때 중고거래 목록 가져오기
  }, [location.search]);

  const formattedPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  }

  // 검색어 필터링
  const filteredTrades = searchTerm ? trades.filter(trade =>
    trade.name.includes(searchTerm) || trade.content.includes(searchTerm)
  ) : trades;

  return (
    <Container>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCategory="중고거래" />
      <Content>
          <Sidebar>
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
              {filteredTrades.map((usedTrade) => (
                <Card 
                  key={usedTrade.id}
                  title={usedTrade.name}
                  price={`${formattedPrice(usedTrade.price)} 원`}
                  location={usedTrade.location}
                  onClick={() => navigate(`/usedTrade/used-trade-view/${usedTrade.id}`, { state: usedTrade })}
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