import { useNavigate, useLocation } from "react-router-dom";

export default function UsedTrade(props) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ... 기존 state들 ...

  // URL의 쿼리 파라미터에서 검색어 가져오기
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const term = query.get('search');
    console.log("가져온 searchTerm:", term);
    
    if (term) {
      setSearchTerm(term);
      // 검색어로 필터링된 중고거래 목록 가져오기
      fetchTradeList(0, term);
    } else {
      fetchTradeList(0);
    }
  }, [location.search]);

  // fetchTradeList 함수 수정
  const fetchTradeList = async (page, searchKeyword = '') => {
    try {
      const response = await axios.get(`/api/usedTrades`, {
        params: {
          sigungu: searchFilter.sigungu,
          emd: searchFilter.emd,
          sort: searchFilter.sort,
          category: searchFilter.category,
          tradeble: searchFilter.tradeble,
          searchTerm: searchKeyword || searchTerm,  // 검색어 파라미터 추가
          page: page,
          size: 10,
        },
      });

      const newTradeList = response.data;
      setTradeList((prevTrades) => (page === 0 ? newTradeList : [...prevTrades, ...newTradeList]));
      setHasNext(!response.data.last);
      setLoading(false);
    } catch (error) {
      console.error("중고거래 리스트를 불러오는데 실패했습니다." + error);
      setLoading(false);
    }
  };

  const handleLocationSelect = (selectedLocation) => {
    console.log("선택된 위치:", selectedLocation);
    const [sigungu, emd] = selectedLocation.split(",").map(loc => loc.trim());
    
    // searchFilter 업데이트
    setSearchFilter(prev => ({
      ...prev,
      sigungu,
      emd: emd || ''  // emd가 없는 경우 빈 문자열로
    }));

    // 선택된 지역으로 중고거래 목록 새로 불러오기
    fetchTradeList(0);
  };

  // handleSearch 함수 추가
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

  // SearchBar에 전달할 props 추가
  return (
    <>
      <HeadContainer>
        <h2>{`${searchFilter.sido} ${searchFilter.sigungu || ''} ${searchFilter.emd || ''} 중고거래`}</h2>
        <Button 
          title="+ 글쓰기" 
          variant="primary" 
          onClick={() => navigate("/usedTradeWrite")} 
        />
      </HeadContainer>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onSelect={handleLocationSelect}  // 지역 선택 핸들러 전달
        onSearch={handleSearch}  // onSearch prop 추가
      />
      {/* ... 나머지 JSX ... */}
    </>
  );
} 