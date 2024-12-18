import { useEffect, useState } from "react";
import { ListContainer } from "../pages/Mypage/MyPageMain";
import Card from "../ui/Card";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Button from "../ui/Button";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

export default function MyTrade() {
  const navigate = useNavigate();
  const [trades, setTrades] = useState([]);
  const [uid, setUid] = useState('');
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);

  useEffect(() => {
    setUid(sessionStorage.getItem('uid'));
  }, []);

  useEffect(() => {
    if (!uid) return;
    fetchMyTrade(0);
  }, [uid]);

  const fetchMyTrade = (page) => {
    axios.get(`/api/usedTrades/my`, {
      params:
      {
        userId: uid,
        page: page,
        size: 8,
      }
    }).then((response) => {
      const newTrades = response.data.content;
      setTrades((prev) => (page === 0 ? newTrades : [...prev, ...newTrades]));
      setHasNext(!response.data.last);
    }).catch((error) => {
      console.error('모임을 불러오는데 실패했습니다.' + error);
    });
  };

  const handleNext = () => {
    fetchMyTrade(page + 1);
    setPage(page + 1);
  };

  const formattedPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  }

  return (
    <ListContainer>
      <h3>내 판매내역</h3>
      {trades.length === 0 && <div>판매내역이 없어요.</div>}
      {trades.length > 0 &&
        <>
          <GridContainer>
            {trades.map((trade) => (
              <Card
                key={trade.id}
                title={trade.name}
                price={`${formattedPrice(trade.price)} 원`}
                location={trade.location}
                imageUrl={trade.images[0]?.url}
                onClick={() => navigate(`/usedTradeView/${trade.id}`,
                  {
                    state:
                    {
                      ...trade, category: trade.category,
                      createdAt: trade.createdDate,
                      tradeable: trade.tradeable,
                      isNegotiable: trade.isNegotiable,
                      isGiveable: trade.selectedTradeType,
                      isGived: trade.isGived,
                      images: trade.images,
                    }
                  })}
                style={{ cursor: "pointer" }}
              />
            ))}
          </GridContainer>
          {hasNext && <Button title='더보기' onClick={handleNext} />}
        </>
      }
    </ListContainer>
  );
}