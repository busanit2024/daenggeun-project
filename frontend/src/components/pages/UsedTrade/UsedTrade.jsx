import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../../ui/Card";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../ui/Button";
import SearchBar from "../../ui/SearchBar";
import axios from "axios";
import Radio from "../../ui/Radio";
import FilterBar from "../../ui/FilterBar";
import RoundFilter from "../../ui/RoundFilter";
import useGeolocation from "../../../utils/useGeolocation";
import { useJsApiLoader } from "@react-google-maps/api";
import Breadcrumb from "../../Breadcrumb";
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

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const FilterItem = styled.div`
  margin-bottom: 16px;
`;

const UsedTrade = () => {
  const location = useLocation(); // URL에서 query 가져오기
  const [trades, setTrades] = useState([]); // 중고거래 목록 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [searchFilter, setSearchFilter] = useState({
    sido: "부산광역시", 
    sigungu: "", 
    emd: "", 
    category: "all", 
    sort: "recent",
    tradeable: false // 거래 가능 여부
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 처음부터 모든 중고 거래 데이터 가져오기
        // const tradesResponse = await axios.get('/api/usedTrades');
        // setTrades(tradesResponse.data);
        await fetchFilteredUsedTrades();

        // 필터 카테고리 데이터 가져오기
        const categoryResponse = await axios.get(`/api/usedTrades/data/filter?categoryName=usedTradeCategory`);
        setCategoryData(categoryResponse.data.filters);
        const response = await fetch('/api/usedTrades');
        const data = await response.json();
        setTrades(data);  // 중고거래 목록 업데이트

        const query = new URLSearchParams(location.search);
        const search = query.get('search');
        if (search) {
            setSearchTerm(search); // URL에서 검색어 가져오기
        } 
      } catch (error) {
        console.error("데이터를 불러오는 데 실패했습니다.", error.response ? error.response.data : error.message);
        setLoading(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryData]);

  useEffect(() => {
    fetchFilteredUsedTrades();
  }, [searchFilter]);

  const fetchFilteredUsedTrades = async () => {
    try {
      console.log("필터 요청 데이터: ", {
        category: searchFilter.category === "all" ? undefined : searchFilter.category,
          sort: searchFilter.sort,
          tradeable: searchFilter.tradeable
      });

      const response = await axios.get('/api/usedTrades', {
        params: {
          category: searchFilter.category === "all" ? undefined : searchFilter.category,
          sort: searchFilter.sort,
          tradeable: searchFilter.tradeable ? true : null
        },
      });
      console.log("필터링된 거래 데이터: ", response.data);
      setTrades(response.data);
    } catch (error) {
      console.error('Error fetching filtered usedTrades:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("필터 변경: ", name, value);
    setSearchFilter((prevFilter) => ({
      ...prevFilter,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  
        console.error('Error fetching trades:', error);
      }
    };

    fetchTrades();  // 컴포넌트가 마운트될 때 중고거래 목록 가져오기
  }, [location.search]);

  const formattedPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  }

  if (loading) {
    return <p>로딩 중...</p>
  }

  // 검색어 필터링
  const filteredTrades = searchTerm ? trades.filter(trade =>
    trade.name.includes(searchTerm) || trade.content.includes(searchTerm)
  ) : trades;

  return (
    <Container>
      <SearchBar />
      <Content>
        <Sidebar>
          <FilterContainer>
            <h3>필터</h3>
            <p />
            <form>
              <FilterItem>
                <label>
                  <input
                    type="checkbox"
                    name="tradeable"
                    checked={searchFilter.tradeable}
                    onChange={handleFilterChange}
                    style={{ marginRight: "5px" }}
                  />
                  거래 가능만 보기
                </label>
              </FilterItem>
              <hr style={{ borderTop: "1px solid rgba(0, 0, 0, 0.1" }}/>
              <FilterItem>
                <h4 style={{ marginTop: "30px", marginBottom: "20px", fontSize: "17px" }}>카테고리</h4>
                <label style={{ display: "block", marginBottom: "10px" }}>
                  <Radio
                    name="category"
                    value="all"
                    checked={searchFilter.category === "all"}
                    onChange={handleFilterChange}
                    style={{ marginRight: "5px" }}
                  />
                  <span style={{ marginLeft: "5px" }}>전체</span>
                </label>
                {[
                  "디지털기기",
                  "생활가전",
                  "가구/인테리어",
                  "생활/주방",
                  "유아동",
                  "유아도서",
                  "여성의류",
                  "여성잡화",
                  "남성패션/잡화",
                  "뷰티/미용",
                  "스포츠/레저",
                  "취미/게임/음반",
                  "도서",
                  "티켓/교환권",
                  "가공식품",
                  "건강기능식품",
                  "반려동물용품",
                  "식물",
                  "기타",
                  "삽니다"
                ].map((category) => (
                  <label key={category} style={{ display: "block", marginTop: "10px" }}>
                    <Radio
                      name="category"
                      value={category}
                      checked={searchFilter.category === category}
                      onChange={handleFilterChange}
                    />
                    <span style={{ marginLeft: "5px" }}>{category}</span>
                  </label>
                ))}
              </FilterItem>
              <hr style={{ borderTop: "1px solid rgba(0, 0, 0, 0.1" }}/>
              <FilterItem>
                <h4 style={{ marginTop: "30px", marginBottom: "20px", fontSize: "17px" }}>정렬</h4>
                <label style={{ display: "block", marginBottom: "10px" }}>
                  <Radio
                    name="sort"
                    value="recent"
                    checked={searchFilter.sort === "recent"}
                    onChange={handleFilterChange}
                  />
                  최신순
                </label>
                <label>
                  <Radio
                    name="sort"
                    value="price"
                    checked={searchFilter.sort === "price"}
                    onChange={handleFilterChange}
                    style={{ marginRight: "10px" }}
                  />
                  가격순
                </label>
              </FilterItem>
            </form>
          </FilterContainer>
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
            {trades.length > 0 ? (
              trades.map((usedTrade) => (
                <Card 
                  key={usedTrade.id}
                  title={usedTrade.name}
                  price={`${formattedPrice(usedTrade.price)} 원`}
                  location={usedTrade.location}
                  onClick={() => navigate(`/usedTrade/used-trade-view/${usedTrade.id}`,
                     { state: 
                      {...usedTrade, category: usedTrade.category, 
                        createdAt: usedTrade.createdDate, 
                        tradeable: usedTrade.tradeable,
                        isNegotiable: usedTrade.isNegotiable,
                        isGiveable: usedTrade.selectedTradeType,
                        isGived: usedTrade.isGived
                      } })}
                  style={{ cursor: "pointer" }}
                />
              ))
            ) : (
              <p>중고 거래가 없습니다.</p>
            )}
          </CardGrid>
        </Main>
      </Content>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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