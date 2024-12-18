import axios from "axios";
import { Children, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import FilterBar from "../../ui/FilterBar";
import Button from "../../ui/Button";
import Radio from "../../ui/Radio";
import useGeolocation from "../../../utils/useGeolocation";
import { useJsApiLoader } from "@react-google-maps/api";
import Breadcrumb from "../../ui/Breadcrumb";
import SearchBar from "../../ui/SearchBar";
import Card from "../../ui/Card";
import categoryData from "../../../asset/categoryData";
import { useArea } from "../../../context/AreaContext";
import Modal from "../../ui/Modal";
import RoundFilter from "../../ui/RoundFilter";
import Switch from "../../ui/Switch";

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
  grid-template-columns: repeat(3, 1fr);
  gap: 1vw;
  width: 100%;
`;

const FilterTagsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const FilterTag = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  background-color:rgb(0, 0, 0);
  color: white;
  border-radius: 15px;
`;

const RemoveButton = styled.button`
  margin-left: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: white;
`;

const libraries = ['places'];

export default function UsedTrade(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { area, setArea } = useArea();
  const [tradeList, setTradeList] = useState([]); // 중고거래 목록
  const [filteredTrades, setFilteredTrades] = useState([]); // 검색 결과 필터링된 중고거래 목록
  const [searchFilter, setSearchFilter] = useState({
    sido: "부산광역시",
    sigungu: area.sigungu,
    emd: area.emd || '',
    sort: "recent",
    category: "all",
    tradeble: false,
    priceRange: { min: 0, max: 999999999999 },
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


  // 내가 고른 필터 저장
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    sort: null,
    price: null,
  });

  const [modalOpen, setModalOpen] = useState(false);

  // URL의 쿼리 파라미터에서 검색어 가져오기
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const term = query.get('search');
    if (term) {
      setSearchTerm(term);
    }
  }, [location.search]);

  useEffect(() => {
    setLoading(true);
    fetchTradeList(0);
  }, [searchFilter]);

  useEffect(() => {
    const uid = sessionStorage.getItem('uid');
    setLoading(true);

    Promise.all([
      axios.get(`/api/data/filter?name=busanJuso`),
      uid ? axios.get(`/user/${uid}`) : Promise.resolve(null)
    ])
      .then(([busanJusoResponse, userResponse]) => {
        const locationFilters = busanJusoResponse.data.locationFilters;
        setBusanJuso(locationFilters);

        if (area && area.sigungu) {
          setSearchFilter(prev => ({
            ...prev,
            sido: "부산광역시",
            sigungu: area.sigungu,
            emd: area.emd || ''
          }));

          // emdList 초기화
          const selectedLocation = locationFilters.find((item) => item.sigungu === area.sigungu);
          if (selectedLocation) {
            const emdNameList = selectedLocation.emd.map((item) => item.emd);
            setEmdList(emdNameList);
          }
        }
      })
      .catch(error => {
        console.error("초기 데이터 로딩 실패:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [area.sigungu, area.emd]);

  const resetFilter = () => {
    setLoading(true);
    
    setSearchFilter((prev) => ({
      ...prev, 
      sido: "부산광역시", 
      sigungu: area.sigungu, 
      emd: area.emd, 
      sort: 'recent', 
      category: 'all', 
      tradeble: false, 
      priceRange: { min: 0, max: 999999999999 }
    }));
  
    setIsFilterOpen(false);
    
    // selectedFilters 초기화
    setSelectedFilters({
      category: [],
      sort: null,
      price: null,
    });
  
    setPage(0);
  };

  const CategoryList = ({ show, children }) => (
    <div style={{ display: show ? 'block' : 'none' }}>
      {children}
    </div>
  );

  // 카테고리 선택 함수
  const selectCategory = (category) => {
    setSearchFilter((prev) => ({
      ...prev,
      category: category,
    }));
  
    setSelectedFilters((prev) => {
      // 이미 선택된 카테고리라면 제거, 아니면 추가
      const newCategories = prev.category.includes(category)
        ? prev.category.filter(c => c !== category) // 선택된 카테고리가 이미 있다면 제거
        : [category]; // 새로운 카테고리만 추가
  
      return {
        ...prev,
        category: newCategories,
      };
    });
  };

  // 정렬 선택 함수
  const handleSortChange = (sort) => {
    setSearchFilter((prev) => ({
      ...prev,
      sort: sort,
    }));

    setSelectedFilters((prev) => ({
      ...prev,
      sort: sort, // 정렬은 하나만 선택
    }));
  };

  // 가격 변경 함수
  const handlePriceChange = (price) => {
    // 가격 포맷팅
    const formatPrice = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    let priceLabel = price === 0 ? "나눔" : `${formatPrice(price)} 원 이하`;

    setSearchFilter((prev) => ({
      ...prev,
      priceRange: { ...prev.priceRange, max: price },
    }));

    setSelectedFilters((prev) => ({
      ...prev,
      price: priceLabel,
    }));
  };

  // 필터 제거 함수
  const handleRemoveFilter = (filter) => {
    setSelectedFilters((prev) => {
      let newFilters = { ...prev };
  
      if (prev.category.includes(filter)) {
        newFilters.category = prev.category.filter(c => c !== filter); // 카테고리 필터에서 제거
        setSearchFilter(prev => ({ ...prev, category: newFilters.category.length > 0 ? newFilters.category[0] : 'all' })); // searchFilter에서도 제거
      } else if (filter === prev.sort) {
        newFilters.sort = null; // 정렬 필터 제거
        setSearchFilter(prev => ({ ...prev, sort: '' }));
      } else if (filter === prev.price) {
        newFilters.price = null; // 가격 필터 제거
        setSearchFilter(prev => ({ ...prev, priceRange: { min: 0, max: 999999999999 } })); // 가격 필터 초기화
      }
      return newFilters; // 변경 사항 저장
    });
  };

  const fetchTradeList = async (page, searchKeyword = '') => {
    try {
      const response = await axios.get(`/api/usedTrades`, {
        params: {
          sigungu: searchFilter.sigungu,
          emd: searchFilter.emd,
          sort: searchFilter.sort,
          category: searchFilter.category !== "all" ? searchFilter.category : undefined,
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
    } catch (error) {
      console.error("중고거래 리스트를 불러오는데 실패했습니다." + error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageData) => {
    console.log("이미지 데이터: ", imageData);
    // 이미지 데이터가 존재하고 유효한 경우에만 URL로 변환
    if (imageData != null) {
      return imageData[0].url; // 이미지 데이터가 배열일 경우 첫 번째 요소 사용
    }
    return null; // 이미지 데이터가 없거나 유효하지 않으면 null 반환
  };

  const handleMoreButton = () => {
    setVisibleCount(prevCount => prevCount + 9);
  };

  const formattedPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  }

  const handleSearch = async (searchTerm) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/usedTrades`, {
        params: {
          sigungu: searchFilter.sigungu,
          emd: searchFilter.emd,
          sort: searchFilter.sort,
          category: searchFilter.category,
          tradeble: searchFilter.tradeble,
          searchTerm: searchTerm,
          page: 0,
          size: 10,
        }
      });
      setTradeList(response.data);
      setHasNext(!response.data.last);
    } catch (error) {
      console.error("검색 중 오류가 발생했습니다.", error);
    } finally {
      setLoading(false);
    }
  };


  const handleWriteClick = () => {
    const userId = sessionStorage.getItem('uid');
    if (!userId) {
      setModalOpen(true);
    } else {
      navigate("/usedTradeWrite");
    }
  }


  useEffect(() => {
    const filteredTradesList = searchTerm ? tradeList.filter(trade => 
        trade.name.includes(searchTerm) || trade.content.includes(searchTerm)
    ) : tradeList;

    const locationFilteredTrades = filteredTradesList.filter(trade => {
        const tradeableMatches = searchFilter.tradeble ? trade.tradeable === true : true;

        // 가격 필터링
        const priceMatches = trade.price >= searchFilter.priceRange.min && trade.price <= searchFilter.priceRange.max;

        // 전지역 선택 시 모든 거래 보여주기
        if (searchFilter.sigungu === '' && searchFilter.emd === '') {
            return tradeableMatches && priceMatches;
        }

        // 특정 구와 동이 선택된 경우
        const locationMatches = searchFilter.sigungu === '' || trade.location.includes(searchFilter.sigungu);
        const emdMatches = searchFilter.emd === '' || trade.location.includes(searchFilter.emd);
        
        // 동 필터링
        const dongMatches = searchFilter.emd === '' || trade.location.includes(searchFilter.emd);

        // 카테고리 필터링
        const categoryMatches = searchFilter.category === 'all' || trade.category === searchFilter.category;

        return locationMatches && emdMatches && tradeableMatches && priceMatches && dongMatches && categoryMatches; // 모든 필터링 조건 추가
    });

    // 정렬 로직 추가 (복사본을 만들어서 정렬)
    const sortedTrades = [...locationFilteredTrades].sort((a, b) => {
        if (searchFilter.sort === 'price') {
            return b.price - a.price; // 가격순 정렬
        }
        return 0; // 정렬 기준이 없을 경우 원래 순서 유지
    });

    setFilteredTrades(sortedTrades); // 필터링 및 정렬된 결과 설정
  }, [tradeList, searchFilter, searchTerm]);

  const routes = [
    { path: "/", name: "홈" },
    { path: "/usedTrade", name: "중고거래" },
  ];

  const isAllRegions = searchFilter.sigungu === '';

  return (
    <>

      <Breadcrumb routes={routes} />
      <Container>
        <HeadContainer>
          <h2>{`${searchFilter.sido} ${searchFilter.sigungu || ''} ${searchFilter.emd || ''} 중고거래`}</h2>
          <Button 
            title="+ 글쓰기" 
            variant="primary" 
            onClick={handleWriteClick} 
          />
        </HeadContainer>
        <InnerContainer>
        <FilterBar>
          <div className="filterBarHeader">
            <h3 className="title">필터</h3>
            <div className="reset" onClick={resetFilter}>초기화</div>
          </div>
          <div className="filterItem">
            <label className="radioWrap">
              <input
                type="checkbox"
                checked={searchFilter.tradeble}
                onChange={(e) => setSearchFilter({ ...searchFilter, tradeble: e.target.checked })}
              />
              <p>거래 가능만 보기</p>
            </label>
          </div>

          <div className="filterItem">
            <h4 className="title" style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
              <span style={{ marginRight: 'auto' }}>지역</span>
              <Switch 
                value={isAllRegions} 
                onChange={() => {
                  if (!isAllRegions) {
                    // '전지역'으로 설정
                    setSearchFilter(prev => ({ ...prev, sigungu: '', emd: '' })); 

                  } else {
                    // 내가 고른 지역을 기본 지역으로 설정
                    setSearchFilter(prev => ({ ...prev, sigungu: area.sigungu, emd: area.emd })); 
                  }
                }} 
              />
              <span style={{ marginLeft: '5px' }}>전지역</span>
            </h4>

            {/* 전지역일 때 '부산광역시' 표시 */}
            {isAllRegions ? (
              <div className="filterList">
                <p>부산광역시</p>
                <label className="radioWrap">
                  <Radio 
                    name="gu" 
                    value="" 
                    checked 
                    onChange={() => {
                      setSearchFilter({ ...searchFilter, sigungu: '', emd: '' });
                    }} 
                  />
                  전지역
                </label>
              </div>
            ) : (
              <div className="filterList">
                <p>{searchFilter.sido}</p>
                <label className="radioWrap">
                  <Radio 
                    name="gu" 
                    value={searchFilter.sigungu} 
                    checked={searchFilter.emd === ''} 
                    onChange={() => {
                      setSearchFilter({ ...searchFilter, emd: '' });
                    }} 
                  />
                  {searchFilter.sigungu}
                </label>
                <EmdFilterWrap open={isFilterOpen}>
                  {searchFilter.emd !== '' && (
                    <label className="radioWrap">
                      <Radio name="dong" value="" checked onChange={() => setSearchFilter({ ...searchFilter, emd: '' })} />
                      {searchFilter.emd}
                    </label>
                  )}
                  {(emdList && searchFilter.emd === '') && emdList.map((dong) => (
                    <label key={dong} className="radioWrap">
                      <Radio 
                        name="dong" 
                        value={dong} 
                        checked={searchFilter.emd === dong} 
                        onChange={() => {
                          setSearchFilter({ ...searchFilter, emd: dong });
                        }} 
                      />
                      {dong}
                    </label>
                  ))}
                </EmdFilterWrap>
                {
                  (emdList && emdList.length > 5 && searchFilter.emd === '') &&
                  <MoreFilterButton className="toggle" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                    {isFilterOpen ? "접기" : "더보기"}
                  </MoreFilterButton>
                }
              </div>
            )}
          </div>


          <div className="filterItem">
            <h4 className="title">카테고리</h4>
            <CategoryList show={isCategoryOpen}>
              {categoryData.map(category => (
                <CategoryItem key={category.name} className="radioWrap">
                  <Radio
                    name="category"
                    value={category.name}
                    checked={searchFilter.category === category.name}
                    onChange={() => selectCategory(category.name)}
                  />
                  {category.name}
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
                onChange={(e) => handleSortChange('recent')} 
              />
              최신순
            </label>
            <label className="radioWrap">
              <Radio 
                name="sort" 
                value="price" 
                checked={searchFilter.sort === 'price'} 
                onChange={(e) => handleSortChange('price')} 
              />
              가격순
            </label>
          </div>
          <div>
            <h4 className="title">가격</h4>
            <CustomSelect
              value={searchFilter.priceRange.max}
              onChange={(e) => handlePriceChange(Number(e.target.value))} // 수정된 부분
            >
              <option value={999999999999}>모든 가격대</option>
              <option value={0}>나눔</option>
              <option value={5000}>5,000원 이하</option>
              <option value={10000}>10,000원 이하</option>
              <option value={30000}>30,000원 이하</option>
              <option value={50000}>50,000원 이하</option>
              <option value={100000}>100,000원 이하</option>
              <option value={500000}>500,000원 이하</option>
              <option value={1000000}>1,000,000원 이하</option>
            </CustomSelect>
          </div>
        </FilterBar>
          <ListContainer>
            {loading ? (
              <LoadingText>
                <h3>중고거래를 찾는 중이에요.</h3>
              </LoadingText>
            ) : (
              <>
              {/* 필터 태그 렌더링 */}
              <FilterTagsContainer>
                {selectedFilters.category.map((filter, index) => (
                  <RoundFilter variant="selected" key={index} title={filter} cancelIcon onClick={() => handleRemoveFilter(filter)} />
                ))}
                {selectedFilters.sort && (
                  <RoundFilter variant="selected" title={selectedFilters.sort} cancelIcon onClick={() => handleRemoveFilter(selectedFilters.sort)} />
                )}
                {selectedFilters.price && (
                  <RoundFilter variant="selected" title={selectedFilters.price} cancelIcon onClick={() => handleRemoveFilter(selectedFilters.price)} />
                )}
              </FilterTagsContainer>

                {filteredTrades.length === 0 ? (
                  <NoSearchResult>
                    <h3>{`${searchFilter.emd ? searchFilter.emd : searchFilter.sigungu} 근처에 중고거래가 없어요.`}</h3>
                    <p>다른 조건으로 검색해주세요.</p>
                  </NoSearchResult>
                ) : (
                  <CardGrid>
                    {(filteredTrades.length > 0 ? filteredTrades : tradeList).slice(0, visibleCount).map((usedTrade) => (
                      <Card 
                        key={usedTrade.id}
                        imageUrl={getImageUrl(usedTrade.images)}
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
                                selectedTradeType: usedTrade.selectedTradeType,
                                isNegotiable: usedTrade.isNegotiable,
                                isGiveable: usedTrade.selectedTradeType,
                                images: usedTrade.images,
                              }
                            }
                          )
                        }
                      />
                    ))}
                  </CardGrid>
                )}
                {!loading && filteredTrades.length > visibleCount && hasNext && (
                  <Button title="더보기" onClick={handleMoreButton} />
                )}
              </>
            )}
          </ListContainer>

        </InnerContainer>

      </Container>

      <Modal title="로그인" isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h3>중고거래를 게시하려면 로그인해야 해요.</h3>
        <div className="buttonWrap">
          <Button title="로그인" variant='primary' onClick={() => { setModalOpen(false); navigate("/login") }} />
          <Button title="닫기" onClick={() => setModalOpen(false)} />
        </div>
      </Modal>
    </>
  );
}