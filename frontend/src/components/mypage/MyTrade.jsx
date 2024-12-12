import { useState } from "react";
import { ListContainer } from "../pages/Mypage/MyPageMain";
import Card from "../ui/Card";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

const usedTrade = {
  id: 1,
  name: '중고거래 상품 이름',
  price: 10000,
  location: '동네',
  category: '카테고리',
  createdDate: '2021-09-01',
  tradeable: true,
  isNegotiable: true,
  selectedTradeType: '판매',
  isGived: false
}

export default function MyTrade() {
  const navigate = useNavigate();
  const [trades, setTrades] = useState([]);

  const formattedPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  }

  return (
    <ListContainer>
      <h3>내 판매내역</h3>
      <GridContainer>
        <Card
          key={usedTrade.id}
          title={usedTrade.name}
          price={`${formattedPrice(usedTrade.price)} 원`}
          location={usedTrade.location}
          onClick={() => navigate(`/usedTrade/used-trade-view/${usedTrade.id}`,
            {
              state:
              {
                ...usedTrade, category: usedTrade.category,
                createdAt: usedTrade.createdDate,
                tradeable: usedTrade.tradeable,
                isNegotiable: usedTrade.isNegotiable,
                isGiveable: usedTrade.selectedTradeType,
                isGived: usedTrade.isGived
              }
            })}
          style={{ cursor: "pointer" }}
        />
      </GridContainer>
    </ListContainer>
  );
}