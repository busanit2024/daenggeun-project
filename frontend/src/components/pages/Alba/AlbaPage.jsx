import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import FilterBar from "../../ui/FilterBar";
import Button from "../../ui/Button";
import AlbaListItem from "../../alba/AlbaListItem";
import RoundFilter from "../../ui/RoundFilter";
import Breadcrumb from "../../ui/Breadcrumb";
import SearchBar from "../../ui/SearchBar";  
import Radio from "../../ui/Radio";
import LocationSearchModal from "../../ui/LocationSearchModal";
import { useArea } from "../../../context/AreaContext";

const HorizontalContainer = styled.div`
display: flex;
gap: 8px;
flex-wrap: wrap;
`;

const StyledRoundFilter = styled(RoundFilter)`
    padding: 4px 8px;
    margin: 4px;
    font-size: 0.9rem;
    display: inline-block;
    cursor: pointer;
    white-space: nowrap;
  `;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const InnerContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  flex-grow: 1;
  width: calc(100% - 260px);
  padding: 0 16px;
`;

const FilterBarContainer = styled(FilterBar)`
  width: 240px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
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

export default function AlbaPage(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDong, setSelectedDong] = useState("");
  const [workType, setWorkType] = useState([]);
  const [category, setCategory] = useState("all");
  const [workDays, setWorkDays] = useState([]);
  const [workTime, setWorkTime] = useState({ start: "", end: "" });
  const [albaList, setAlbaList] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [workDaysData, setWorkDaysData] = useState([]);
  const [workTypeData, setWorkTypeData] = useState([
    { id: 'longterm', name: '1개월 이상' },
    { id: 'shortterm', name: '단기' }
  ]);
  const [itemsToShow, setItemsToShow] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const { area } = useArea();
  const [searchFilter, setSearchFilter] = useState({
    sigungu: "",
    emd: "",
    category: category
  });

  const [selectedCategory, setSelectedCategory] = useState("알바");

  // 카테고리 데이터를 가져오기 위한 useEffect
  useEffect(() => {
    axios.get(`/api/data/filter?name=albaCategory`).then((response) => {
      setCategoryData(response.data.filters);
    })
      .catch((error) => {
        console.error("카테고리를 불러오는데 실패했습니다." + error);
      });
  }, []);

  // 지역 데이터를 가져오기 위한 useEffect
  useEffect(() => {
    axios.get(`/api/data/filter?name=busanJuso`)
      .then((response) => {
        setRegionData(response.data.locationFilters);
      })
      .catch((error) => {
        console.error("지역 필터 데이터를 불러오는데 실패했습니다." + error);
      });
  }, []);

  // 근무 요일 데이터를 가져오기 위한 useEffect
  useEffect(() => {
    axios.get(`/api/data/filter?name=workDays`)
      .then((response) => {
        setWorkDaysData(response.data.filters);
      })
      .catch((error) => {
        console.error("근무 요일 데이터를 불러오는데 실패했습니다." + error);
      });
  }, []);

   // 알바 리스트 데이터를 가져오기 위한 useEffect
   useEffect(() => {
    const fetchData = async () => {
      try {
        // 지역이 선택되지 않았다면 데이터를 가져오지 않음
        if (!selectedRegion) {
          setAlbaList([]);
          return;
        }

        const response = await axios.get(`/api/alba`, {
          params: {
            sigungu: selectedRegion,
            emd: selectedDong || undefined,
            category: category !== "all" ? category : undefined,
            workPeriod: workType.length > 0 ? workType.join(",") : undefined,
            workDays: workDays.length > 0 ? workDays.join(",") : undefined,
            start: workTime.start || undefined,
            end: workTime.end || undefined,
            searchTerm: searchTerm.trim() !== "" ? searchTerm : undefined,
          }
        });

        // 지역 기반으로 먼저 필터링
        const filteredByLocation = response.data.filter(alba => 
          alba.location.sigungu === selectedRegion &&
          (!selectedDong || alba.location.emd === selectedDong)
        );

        // 나머지 필터 적용
        const filteredList = filteredByLocation.filter(alba => {
          return (
            (category === "all" || alba.category === category) &&
            (workType.length === 0 || workType.includes(alba.workPeriod)) &&
            (workDays.length === 0 || workDays.every(day => alba.workDays.includes(day))) &&
            (!workTime.start || alba.workTime.start >= workTime.start) &&
            (!workTime.end || alba.workTime.end <= workTime.end) &&
            (!searchTerm.trim() || 
              alba.title.includes(searchTerm.trim()) || 
              (alba.description && alba.description.includes(searchTerm.trim())))
          );
        });

        setAlbaList(filteredList);
      } catch (error) {
        console.error("알바 리스트를 불러오는데 실패했습니다:", error);
      }
    };

    fetchData();
  }, [selectedRegion, selectedDong, category, workType, workDays, workTime, searchTerm]);

  // 컴포넌트 마운트 시 초기 검색 실행
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const searchQuery = query.get('search');
    
    if (searchQuery) {
      setSearchTerm(searchQuery);
      handleSearch(searchQuery);
    } else {
      // 검색어 없이 초기 검색
      handleSearch('');
    }
  }, []);  // 컴포넌트 마운트 시 한 번만 실행

  // URL 변경 시 검색 실행 (기존 useEffect 유지)
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const searchQuery = query.get('search');
    
    if (searchQuery) {
      setSearchTerm(searchQuery);
      handleSearch(searchQuery);
    } else {
      handleSearch('');
    }
  }, [location.search]);

  const handleLocationSelect = (selectedLocation) => {
    const [sigungu, emd] = selectedLocation.split(",").map(loc => loc.trim());
    setSelectedRegion(sigungu);
    setSelectedDong(emd || '');
    setIsModalOpen(false);
  };


  const resetFilter = () => {
    setSelectedRegion("");
    setSelectedDong("");
    setCategory("all");
    setWorkType([]);
    setWorkDays([]);
    setWorkTime({ start: "", end: "" });
    setSearchTerm("");
  };

  const handleWorkTypeChange = (workTypeId) => {
    if (workType.includes(workTypeId)) {
      setWorkType(workType.filter(type => type !== workTypeId));
    } else {
      setWorkType([...workType, workTypeId]);
    }
  };

  const handleWorkDayChange = (day) => {
    if (workDays.includes(day)) {
      setWorkDays(workDays.filter(d => d !== day));
    } else {
      setWorkDays([...workDays, day]);
    }
  };

  const handleWorkTimeChange = (e) => {
    const { name, value } = e.target;
    setWorkTime(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    setSearchFilter(prev => ({
      ...prev,
      category: newCategory
    }));
  };

  const handleShowMore = () => {
    setItemsToShow(prev => prev + 5);
  };


  const filteredAlbaList = albaList.filter(alba => {
    return (
      // 지역 필터링
      (!selectedRegion || alba.location.sigungu === selectedRegion) &&
      (!selectedDong || alba.location.emd === selectedDong) &&
      // 추가 필터링
      (category === "all" || alba.category === category) &&
      (workType.length === 0 || workType.includes(alba.workPeriod)) &&
      (workDays.length === 0 || workDays.every(day => alba.workDays.includes(day))) &&
      (!workTime.start || alba.workTimeStart >= workTime.start) &&
      (!workTime.end || alba.workTimeEnd <= workTime.end) &&
      // 검색어 필터링
      (!searchTerm.trim() || alba.title.includes(searchTerm.trim()) || alba.description.includes(searchTerm.trim()))
    );
  });

  const handleSearch = async (searchTerm) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/alba/search`, {
        params: {
          sigungu: area.sigungu || searchFilter.sigungu,
          emd: area.emd || searchFilter.emd || undefined,
          category: category,
          searchTerm: searchTerm || undefined,
          page: 0,
          size: 10,
        }
      });
      setAlbaList(response.data);
      setHasNext(!response.data.last);
      
      // 검색어가 있으면 URL 업데트
      if (searchTerm) {
        navigate(`/alba?search=${searchTerm}`, { replace: true });
      }
    } catch (error) {
      console.error("검색 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  const routes = [
    { path: "/", name: "홈" },
    { path: "/alba", name: "알바 검색" },
    { path: "/alba/create", name: "알바 게시물 작성" },
    { path: "/alba/{id}", name: "알바 상세 보기" },
    { path: "/alba/{id}/edit", name: "알바 게시물 수정" },
  ];
  
  useEffect(() => {
    // Toolbar에서 이동한 경우 자동 검색 실행
    if (location.state?.fromToolbar) {
        handleSearch('');
    }
  }, []);

  return (
    <Container>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} 
          selectedCategory={selectedCategory}  setSelectedCategory={setSelectedCategory} 
          onSelect={handleLocationSelect} onSearch={handleSearch} />

      {isModalOpen && (
        <LocationSearchModal 
          onSelect={handleLocationSelect}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <Breadcrumb routes={routes} />

      <InnerContainer>
        {/* 필터 바 */}
        <FilterBarContainer>
          <div className="filterBarHeader">
            <h3 className="title">필터</h3>
            <div className="reset" onClick={resetFilter}>초기화</div>
          </div>

          <div className="filterItem">
            <h4 className="title">근무 유형</h4>
            <div className="filterList">
              {workTypeData.map((item) => (
                <div key={item.id} className="radioWrap">
                  <Radio
                    type="radio"
                    id={item.name}
                    name="workType"
                    value={item.name}
                    onChange={() => handleWorkTypeChange(item.name)}
                    checked={workType.includes(item.name)}
                  />
                  <label htmlFor={item.name}>{item.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="filterItem">
            <h4 className="title">하는 일</h4>
            <div className="filterList">
              {categoryData.map((item) => (
                <div key={item.name} className="radioWrap">
                  <Radio
                    type="radio"
                    id={item.name}
                    name="category"
                    value={item.name}
                    onChange={handleCategoryChange}
                    checked={item.name === category}
                  />
                  <label htmlFor={item.name}>{item.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="filterItem">
            <h4 className="title">근무 요일</h4>
            <div className="filterList">
            <HorizontalContainer>
              {workDaysData.map((day) => (
                <StyledRoundFilter
                  key={day.name}
                  title={day.name}
                  variant={workDays.includes(day.name) ? 'selected' : 'category'}
                  onClick={() => handleWorkDayChange(day.name)}
                />
              ))}
           </HorizontalContainer>
          </div>
            
          </div>

          <div className="filterItem">
            <h4 className="title">근무 시간</h4>
            <div className="filterList">
              <div>
                <label htmlFor="workTimeStart">시작 시간: </label>
                <input
                  type="time"
                  id="workTimeStart"
                  name="start"
                  value={workTime.start}
                  onChange={handleWorkTimeChange}
                />
              </div>
              <div>
                <label htmlFor="workTimeEnd">종료 시간: </label>
                <input
                  type="time"
                  id="workTimeEnd"
                  name="end"
                  value={workTime.end}
                  onChange={handleWorkTimeChange}
                />
              </div>
            </div>
          </div>
        </FilterBarContainer>
        {/* 알바 리스트 컨테이너 */}

        <ListContainer>

          {(category !== 'all' || workType.length > 0 || workDays.length > 0 || workTime.start || workTime.end || searchTerm.trim() !== "" || selectedRegion !== "" || selectedDong !== "") &&
            <FilterContainer>
              {category !== 'all' && <RoundFilter title={category} variant='search' cancelIcon onClick={() => setCategory('all')} />}
              {workType.map((type) => (
                <RoundFilter key={type} title={workTypeData.find(item => item.name === type)?.name} variant='search' cancelIcon onClick={() => handleWorkTypeChange(type)} />
              ))}
              {workDays.map((day) => (
                <RoundFilter key={day} title={day} variant='search' cancelIcon onClick={() => handleWorkDayChange(day)} />
              ))}
              {workTime.start && <RoundFilter title={`시작 시간: ${workTime.start}`} variant='search' cancelIcon onClick={() => setWorkTime(prev => ({ ...prev, start: "" }))} />}
              {workTime.end && <RoundFilter title={`종료 시간: ${workTime.end}`} variant='search' cancelIcon onClick={() => setWorkTime(prev => ({ ...prev, end: "" }))} />}
              {selectedRegion && <RoundFilter title={selectedRegion} variant='search' cancelIcon onClick={() => setSelectedRegion("")} />}
              {selectedDong && <RoundFilter title={selectedDong} variant='search' cancelIcon onClick={() => setSelectedDong("")} />}
              {searchTerm.trim() !== "" && <RoundFilter title={`검색어: ${searchTerm}`} variant='search' cancelIcon onClick={() => setSearchTerm("")} />}
                
            </FilterContainer>
            
          }

          {albaList.length === 0 && (
            <NoSearchResult>
              <h3>{`${selectedRegion || "해당 지역"} 근처에 알바가 없어요.`}</h3>
              <p>다른 조건으로 검색해주세요.</p>
            </NoSearchResult>
          )}

          {filteredAlbaList.slice(0, itemsToShow).map((alba) => (
            <AlbaListItem key={alba.id} alba={alba} />
          ))}

          {itemsToShow < albaList.length && (
            <Button title="더보기" onClick={handleShowMore} />
          )}
                  <Button title="글쓰기" variant="primary" onClick={() => navigate("/alba/create")}></Button>

        </ListContainer>
      </InnerContainer>
    </Container>
  );
}
