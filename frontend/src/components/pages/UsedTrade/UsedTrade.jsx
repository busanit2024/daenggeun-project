import axios from "axios";
import { Children, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import FilterBar from "../../ui/FilterBar";
import Button from "../../ui/Button";
import RoundFilter from "../../ui/RoundFilter";
import Radio from "../../ui/Radio";
import useGeolocation from "../../../utils/useGeolocation";
import { useJsApiLoader } from "@react-google-maps/api";
import Breadcrumb from "../../Breadcrumb";
import Modal from "../../ui/Modal";
import SearchBar from "../../ui/SearchBar";
import Card from "../../ui/Card";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const HeadContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 16px 0px;
`;

const InnerContainer = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
  padding: 0 16px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const CategoryItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px;

  &:hover {
    input[type="radio"] {
      background-color: #e0e0e0;
    }
  }
`;

const NoSearchResult = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 88px 0;
  & h3 {
    margin: 0;
  }

  & p {
    margin: 0;
    color: #666666;
  }
`;

const LoadingText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 88px 0;
  & h3 {
    margin: 0;
  }

  & p {
    margin: 0;
    color: #666666;
  }
`;

const CustomSelect = styled.select`
  flex-grow: 1;
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
  max-height: ${props => props.open ? '360px' : '160px'};
  overflow-y: ${props => props.open ? 'auto' : 'hidden'};
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

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr));
  gap: 1vw;
  width: 100%;
`;

const libraries = ['places'];

export default function UsedTrade(props) {
  const navigate = useNavigate();
  const [tradeList, setTradeList] = useState([]); // 중고거래 목록
  const [searchFilter, setSearchFilter] = useState({
    sido: "부산광역시",
    sigungu: "",
    emd: "",
    sort: "recent",
    category: "all",
    tradeble: true,
  });
  const [busanJuso, setBusanJuso] = useState([]);
  const [emdList, setEmdList] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(9); // 한 번에 보이는 카드의 최대 수
  const [selectedCategory, setSelectedCategory] = useState("중고거래");
  // const [location, setLocation] = useState(location.state);

  const { isLoaded: isJsApiLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
    language: 'ko',
    region: 'KR',
  });

  const currentLocation = useGeolocation(isJsApiLoaded);

  useEffect(() => {
    axios.get(`/api/data/filter?name=busanJuso`).then((response) => {
      setBusanJuso(response.data.locationFilters);
    }).catch((error) => {
      console.error("부산 주소를 불러오는데 실패했습니다." + error);
    });
  }, []);

  useEffect(() => {
    if (currentLocation.sido && currentLocation.sigungu) {
      setSearchFilter((prev) => ({ ...prev, sido: currentLocation.sido, sigungu: currentLocation.sigungu }));
    }
  }, [currentLocation.sigungu]);

  useEffect(() => {
    setLoading(true);
    fetchTradeList(0);
  }, [searchFilter]);

  useEffect(() => {
    setLoading(true);
    setSearchFilter((prev) => ({ ...prev, emd: '' }));
    getEmdList(searchFilter.sigungu);
    setIsFilterOpen(false);
  }, [searchFilter.sigungu, busanJuso]);

  const resetFilter = () => {
    setLoading(true);
    setSearchFilter((prev) => ({ ...prev, sido: currentLocation.sido, sigungu: currentLocation.sigungu, emd: '', sort: '', category: '' }));
    setIsFilterOpen(false);
    setPage(0);
  };

  const CategoryList = ({ show, children }) => (
    <div style={{ display: show ? 'block' : 'none' }}>
      {children}
    </div>
  );

  const selectCategory = (category) => {
    setSearchFilter((prev) => ({
      ...prev,
      category: category,
    }));
  };

  const fetchTradeList = async (page) => {
    try {
      const response = await axios.get(`/api/usedTrades`, {
        params: {
          sigungu: searchFilter.sigungu,
          emd: searchFilter.emd,
          sort: searchFilter.sort,
          category: searchFilter.category,
          tradeble: searchFilter.tradeble,
          page: page,
          size: 10,
        },
      });

      console.log(response.data);
      //setTradeList(response.data);

      const newTradeList = response.data;
      setTradeList((prevTrades) => (page === 0 ? newTradeList : [...prevTrades, ...newTradeList]));
      setHasNext(!response.data.last);
      setLoading(false);
    } catch (error) {
      console.error("중고거래 리스트를 불러오는데 실패했습니다." + error);
      setLoading(false);
    }
  };

  const getEmdList = (gu) => {
    if (busanJuso) {
      if (!gu) {
        setEmdList([]);
      } else {
        const emdList = busanJuso.find((item) => item.sigungu === gu)?.emd;
        const emdNameList = emdList?.map((item) => item.emd);
        setEmdList(emdNameList);
      }
    }
  };

  const handleMoreButton = () => {
    setVisibleCount(prevCount => prevCount + 9);
  };

  const formattedPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  }

  // 검색어 필터링
  const filteredTrades = searchTerm ? tradeList.filter(trade => 
    trade.name.includes(searchTerm) || trade.content.includes(searchTerm)
  ) : tradeList;

  const locationFilteredTrades = filteredTrades.filter(trade => {
    // 전지역 선택 시 모든 거래 보여주기
    if (searchFilter.sigungu === "" && searchFilter.emd === "") {
      return true;
    }

    // 특정 구와 동이 선택된 경우
    const locationMatches = trade.location.includes(searchFilter.sigungu);
    const emdMatches = searchFilter.emd === "" || trade.location.includes(searchFilter.emd);

    return locationMatches && emdMatches;
  });

  const routes = [
    { path: "/", name: "홈" },
    { path: "/usedTrade", name: "중고거래" },
  ];

  return (
    <>
    <SearchBar
     searchTerm = {searchTerm} 
     setSearchTerm = {setSearchTerm}
     selectedCategory={selectedCategory}
     setSelectedCategory={setSelectedCategory}
    />
      <Breadcrumb routes={routes} />
      <Container>
        <HeadContainer>
          <h2>{`${searchFilter.sido} ${searchFilter.sigungu} ${searchFilter.emd} 중고거래`}</h2>
          <Button 
            title="+ 글쓰기" 
            variant="primary" 
            onClick={() => navigate("/usedTradeWrite")} 
          />
        </HeadContainer>
        <InnerContainer>
          <FilterBar>
            <div className="filterBarHeader">
              <h3 className="title">필터</h3>
              <div className="reset" onClick={resetFilter}>초기화</div>
            </div>
            <div className="filterItem">
              <h4 className="title" style={{ display: 'flex', width: '100%', gap: '8px', alignItems: 'center' }}>지역
                <CustomSelect value={searchFilter.sigungu} onChange={(e) => setSearchFilter({ ...searchFilter, sigungu: e.target.value })}>
                  <option value="">전지역</option>
                  {busanJuso.map((item) => (
                    <option key={item.sigungu} value={item.sigungu}>{item.sigungu}</option>
                  ))}
                </CustomSelect>
              </h4>

              <div className="filterList">
                <p>{searchFilter.sido}</p>
                <label className="radioWrap">
                  <Radio name="gu" value={searchFilter.sigungu} checked={searchFilter.emd === ''} onChange={() => setSearchFilter({ ...searchFilter, emd: '' })} />
                  {searchFilter.sigungu === '' ? "전지역" : searchFilter.sigungu}
                </label>
                <EmdFilterWrap open={isFilterOpen}>
                  {searchFilter.emd !== '' &&
                    <label className="radioWrap">
                      <Radio name="dong" value="" checked onChange={() => setSearchFilter({ ...searchFilter, emd: '' })} />
                      {searchFilter.emd}
                    </label>
                  }
                  {(emdList && searchFilter.emd === '') && emdList.map((dong) => (
                    <label key={dong} className="radioWrap">
                      <Radio name="dong" value={dong} checked={searchFilter.emd === dong} onChange={() => setSearchFilter({ ...searchFilter, emd: dong })} />
                      {dong}
                    </label>
                  ))}
                </EmdFilterWrap>
                {
                  (emdList && emdList.length > 5 && searchFilter.emd === '') &&
                  <MoreFilterButton className="toggle" onClick={() => setIsFilterOpen(!isFilterOpen)}>{isFilterOpen ? "접기" : "더보기"}</MoreFilterButton>
                }

              </div>
            </div>
            
            <div className="filterItem">
              <h4 className="title">카테고리</h4>
              <CategoryList show={isCategoryOpen}>
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
                ].map(category => (
                  <CategoryItem key={category} className="radioWrap">
                    <Radio
                      name="category"
                      value={category}
                      checked={searchFilter.category === category}
                      onChange={() => selectCategory(category)}
                    />
                    {category}
                  </CategoryItem>
                ))}
              </CategoryList>
            </div>
            <div className="filterItem">
              <h4 className="title">정렬</h4>
              <label className="radioWrap">
                <Radio 
                  name="sort" 
                  value="recent" 
                  checked={searchFilter.sort === 'recent'} 
                  onChange={(e) => setSearchFilter({ ...searchFilter, sort: 'recent' })} />
                최신순
              </label>
              <label className="radioWrap">
                <Radio 
                  name="sort" 
                  value="name" 
                  checked={searchFilter.sort === 'price'} 
                  onChange={(e) => setSearchFilter({ ...searchFilter, sort: 'price' })} />
                가격순
              </label>
            </div>
          </FilterBar>

          <ListContainer>
            {loading ? (
              <LoadingText>
                <h3>중고거래를 찾는 중이에요.</h3>
              </LoadingText>
            ) : (
              <>
                {locationFilteredTrades.length === 0 ? (
                  <NoSearchResult>
                    <h3>{`${searchFilter.emd ? searchFilter.emd : searchFilter.sigungu} 근처에 중고거래가 없어요.`}</h3>
                    <p>다른 조건으로 검색해주세요.</p>
                  </NoSearchResult>
                ) : (
                  <CardGrid>
                    {(locationFilteredTrades.length > 0 ? locationFilteredTrades : tradeList).slice(0, visibleCount).map((usedTrade) => (
                      <Card 
                        key={usedTrade.id}
                        title={usedTrade.name}
                        price={`${formattedPrice(usedTrade.price)} 원`}
                        location={usedTrade.location}
                        onClick={() =>
                          navigate(
                            `/usedTradeView/${usedTrade.id}`,
                            {
                              state: {
                                ...usedTrade,
                                category: usedTrade.category,
                                createdAt: usedTrade.createdDate,
                                tradeable: usedTrade.tradeable,
                                location: usedTrade.location,
                                isNegotiable: usedTrade.isNegotiable,
                                isGiveable: usedTrade.selectedTradeType,
                                isGived: usedTrade.isGived,
                              }
                            }
                          )
                        }
                      />
                    ))}
                  </CardGrid>
                )}
                {!loading && locationFilteredTrades.length > visibleCount && hasNext && (
                  <Button title="더보기" onClick={handleMoreButton} />
                )}
              </>
            )}
          </ListContainer>

        </InnerContainer>

      </Container>
    </>
  );
}