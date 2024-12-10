import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../../ui/Card";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../ui/Button";
import axios from "axios";
import Radio from "../../ui/Radio";
import useGeolocation from "../../../utils/useGeolocation";
import { useJsApiLoader } from "@react-google-maps/api";
import Breadcrumb from "../../Breadcrumb";
import SearchBar from "../../ui/SearchBar";
import Modal from "../../ui/Modal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 2vw;
  min-height: 150vh;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
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
  max-height: calc(100vh - 100px);

  @media (max-width: 768px) {
    flex: 0 0 auto;
    width: 100%;
    margin-bottom: 16px;
    max-height: none;
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
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 0;
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
  max-height: 100%;
  padding: 10px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    max-height: none;
  }
`;

const FilterItem = styled.div`
  margin-bottom: 16px;
`;

const CustomSelect = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
`;

const EmdFilterWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  gap: 8px;
  max-height: ${(props) => (props.open ? '360px' : '160px')};
  overflow-y: ${(props) => (props.open ? 'auto' : 'hidden')};
  width: 100%;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #dcdcdc;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f9f9f9;
  }
`;

const MoreFilterButton = styled.div`
  cursor: pointer;
  color: #FF7B07;
  font-size: 16px;
`;

const UsedTrade = () => {
  const location = useLocation();
  const [busanJuso, setBusanJuso] = useState([]);
  const [trades, setTrades] = useState([]); // 중고거래 목록 상태
  const [searchTerm, setSearchTerm] = useState("");
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
  
  const [ selectedCategory, setSelectedCategory]= useState("중고거래");
  const [visibleCount, setVisibleCount] = useState(3); // 처음 보이는 카드 수
  const [emdList, setEmdList] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const navigate = useNavigate();

  const libraries = ['places'];

  const { isLoaded: isJsApiLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
    language: 'ko',
    region: 'KR',
  });

  const currentLocation = useGeolocation(isJsApiLoaded);
  
  useEffect(() => {
    const fetchTrades = async () => {
      setLoading(true);
      try {
        // 처음부터 모든 중고 거래 데이터 가져오기
        // const tradesResponse = await axios.get('/api/usedTrades');
        // setTrades(tradesResponse.data);
        await fetchFilteredUsedTrades();

        const query = new URLSearchParams(location.search);
        const search = query.get('search');
        if (search) {
          setSearchTerm(search);  // URL에서 검색어 가져오기
        }

        // 필터 카테고리 데이터 가져오기
        const categoryResponse = await axios.get(`/api/usedTrades/data/filter?categoryName=usedTradeCategory`);
        setCategoryData(categoryResponse.data.filters);
      } catch (error) {
        console.error("데이터를 불러오는 데 실패했습니다.", error.response ? error.response.data : error.message);
        console.error('Error fetching trades:', error);
        setLoading(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, [location.search]);

  useEffect(() => {
    if (currentLocation.sigungu) {
      setSearchFilter(prev => ({
        ...prev,
        sido: currentLocation.sido,
        sigungu: currentLocation.sigungu,
      }));
      handleFilterChange({
        target: { name: "sigungu", value: currentLocation.sigungu }
      });
    }
  }, [currentLocation]);

  useEffect(() => {
    fetchFilteredUsedTrades();
  }, [searchFilter]);

  const fetchFilteredUsedTrades = async () => {
    try {
      console.log("필터 요청 데이터: ", {
        category: searchFilter.category === "all" ? undefined : searchFilter.category,
        sort: searchFilter.sort,
        tradeable: searchFilter.tradeable,
        search: searchTerm,
        sigungu: searchFilter.sigungu,
        emd: searchFilter.emd,
      });

      const response = await axios.get('/api/usedTrades', {
        params: {
          category: searchFilter.category === "all" ? undefined : searchFilter.category,
          sort: searchFilter.sort,
          tradeable: searchFilter.tradeable ? true : null,
          search: searchTerm,
          sigungu: searchFilter.sigungu,
          emd: searchFilter.emd,
        },
      });
      console.log("필터링된 거래 데이터: ", response.data);
      setTrades(response.data);
    } catch (error) {
      console.error('Error fetching filtered usedTrades:', error);
      console.error('Error fetching filtered usedTrades:', error.response ? error.response.data : error.message);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("필터 변경: ", name, value);

    if (name === "sigungu") {
      // sigungu가 변경될 때 emd 리스트 같이 업데이트
      const emdList = busanJuso.find((item) => item.sigungu === value)?.emd;
      const emdNameList = emdList?.map((item) => item.emd);
      setEmdList(emdNameList);
    }

    setSearchFilter((prevFilter) => ({
      ...prevFilter,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  
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

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 3);  // 3개씩 추가
  };

  return (
    <Container>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} 
        selectedCategory={selectedCategory}  setSelectedCategory={setSelectedCategory} />
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
                <label style={{ alignItems: "center", gap: "10px" }}>
                  <h4 style={{ margin: 0 }}>
                    위치
                    <CustomSelect
                      name="sigungu"
                      value={searchFilter.sigungu}
                      onChange={handleFilterChange}
                    >
                      <option value="">전지역</option>
                      {busanJuso.map((item) => (
                        <option key={item.sigungu} value={item.sigungu}>{item.sigungu}</option>
                      ))}
                    </CustomSelect>
                  </h4>
                  <div className="filterList">
                    <p>{searchFilter.sido}</p>
                    <label className="radioWrap">
                      <Radio
                        name="gu"
                        value={searchFilter.sigungu}
                        checked={searchFilter.emd === ''}
                        onChange={() => setSearchFilter({ ...searchFilter, emd: '' })}
                      />
                      {searchFilter.sigungu === '' ? "전지역" : searchFilter.sigungu}
                    </label>
                      <EmdFilterWrap open={isFilterOpen}>
                      {searchFilter.emd !== '' && (
                        <label className="radioWrap">
                          <Radio name="dong" value="" checked onChange={() => setSearchFilter({ ...searchFilter, emd: '' })} />
                          {searchFilter.emd}
                        </label>
                      )}
                      {emdList && searchFilter.emd === '' && emdList.map((dong) => (
                        <label key={dong} className="radioWrap">
                          <Radio
                            name="dong"
                            value={dong}
                            checked={searchFilter.emd === dong}
                            onChange={() => setSearchFilter({ ...searchFilter, emd: dong })}
                          />
                          {dong}
                        </label>
                          ))}
                        </EmdFilterWrap>
                          {emdList && emdList.length > 5 && searchFilter.emd === '' && (
                            <MoreFilterButton className="toggle" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                              {isFilterOpen ? "접기" : "더보기"}
                            </MoreFilterButton>
                          )}
                  </div>
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
            {filteredTrades.length > 0 ? (
              filteredTrades.slice(0, visibleCount).map((usedTrade) => (
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
          {filteredTrades.length > visibleCount && (
            <Button 
              title="더보기" 
              onClick={handleLoadMore} 
              style={{ marginTop: "20px" }}
            />
          )}
        </Main>
      </Content>
    </Container>
  );
};

export default UsedTrade;