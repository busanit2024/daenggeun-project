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
import Modal from "../../ui/Modal";

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

const sessionId = sessionStorage.getItem('uid');

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
    sido: "부산광역시", sigungu: "", emd: "", 
    category: "all", sort: "" });
    const [modalOpen, setModalOpen] = useState('');

  const [selectedCategory, setSelectedCategory] = useState("알바");
  //const sessionId = sessionStorage.getItem('uid');

  const handleLocationSelect = async (selectedLocation) => {
    const [sigungu, emd] = selectedLocation.split(",").map(loc => loc.trim());
    setSelectedRegion(sigungu);
    setSelectedDong(emd || '');
    setIsModalOpen(false);

    try {
      const response = await axios.get(`/api/alba`, {
        params: {
          sigungu: sigungu,
          emd: emd || undefined,
          category: category !== "all" ? category : undefined,
          workPeriod: workType.length > 0 ? workType.join(",") : undefined,
          workDays: workDays.length > 0 ? workDays.join(",") : undefined,
          start: workTime.start || undefined,
          end: workTime.end || undefined
        }
      });

      setAlbaList(response.data);
      console.log("albalistlength", albaList.length);

    } catch (error) {
      console.error("알바 리스트를 불러오는데 실패했습니다:", error);
    }
  };

  // 카테고리 데이터를 가져오기 위한 useEffect
  useEffect(() => {
    axios.get(`/api/data/filter?name=albaCategory`).then((response) => {
      setCategoryData(response.data.filters);
    })
      .catch((error) => {
        console.error("카테고리를 불러오는데 실패했습니다." + error);
      });
  }, []);

  useEffect(() => {
      const fetchMemberInfo = async (userId) => {
        try {
          const response = await axios.get(`/user/find?uid=${userId}`);
          setSelectedRegion(response.data.location[0].sigungu);
          setSelectedDong(response.data.location[0].emd);
          
        } catch (error) {
          console.error("사용자 정보 불러오기 실패:", error);
        }
      };
  
      if (sessionId) {
        fetchMemberInfo(sessionId);
      }      
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
        console.log("selectedRegion",selectedRegion)
        console.log("selectedDong",selectedDong)
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
        }
      );
      console.log("filteredList length",filteredList.length);
      console.log("itemsToShow length",itemsToShow);
      console.log("filteredListttttttttt length",typeof filteredList.length);
      console.log("itemsToShowttttttt length",typeof itemsToShow);
      console.log(itemsToShow < filteredList.length)
        setAlbaList(filteredList);
        console.log("albalistlength", albaList.length);
        console.log("filteredList length after",filteredList.length);

      } catch (error) {
        console.error("알바 리스트를 불러오는데 실패했습니다:", error);
      } 
    };
    
    // selectedRegion이나 selectedDong이 변경될 때마다 fetchData 실행
    if (selectedRegion) {

      console.log("선택된 구",selectedRegion)
      console.log("선택된 동",selectedDong)
      fetchData();
    }
  }, [selectedRegion, selectedDong, category, workType, workDays, workTime, searchTerm]);

  useEffect(() => {
    console.log("@@@@@Updated albaList:", albaList);
  }, [albaList]);

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
  }, []); 

  


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
      setWorkType([workTypeId]);
    }
  };

  const handleWorkDayChange = (day) => {
    if (workDays.includes(day)) {
      setWorkDays(workDays.filter((d) => d !== day)); // 선택 해제
    } else {
      setWorkDays([...workDays, day]); // 선택 추가
    }
  };

  const handleWorkTimeChange = (e) => {
    const { name, value } = e.target;
    setWorkTime(prev => ({ ...prev, [name]: value }));
  };
  const handleAlbaFilter = () => {
    if (sessionStorage.getItem('uid')) {
      setSearchFilter({ ...searchFilter, sigungu: '', emd: '', category: 'all', sort: '', uid: sessionStorage.getItem('uid') });
    }
  }
  const handleCreateButton = () => {
    if (sessionStorage.getItem('uid')) {
      navigate("/alba/create");
    } else {
      setModalOpen('login');
    }
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


  const filteredAlbaList = albaList.filter((alba) => {
    
    return (
      // 지역 필터링
      (!selectedRegion || alba.location.sigungu === selectedRegion) &&
      (!selectedDong || alba.location.emd === selectedDong) &&
      // 추가 필터링
      (category === "all" || alba.category === category) &&
      (workType.length === 0 || workType.includes(alba.workPeriod)) &&
      (workDays.length === 0 || workDays.some((day) => alba.workDays.includes(day))) && // 수정된 부분
      (!workTime.start || alba.workTimeStart >= workTime.start) &&
      (!workTime.end || alba.workTimeEnd <= workTime.end) &&
      // 검색어 필터링
      (!searchTerm.trim() || alba.title.includes(searchTerm.trim()) || alba.description.includes(searchTerm.trim()))
      
    );
  });
  

  const handleSearch = async (searchTerm) => {
    setLoading(true);
    try {
      // API 호출용 파라미터
      const params = {
        category: category,
        page: 0,
        size: 10,
      };
  
      // 검색어가 있는 경우에만 searchTerm 추가
      if (searchTerm && searchTerm.trim()) {
        params.searchTerm = searchTerm;
      }
  
      // 지역 정보가 있는 경우에만 추가
      if (selectedRegion || area.sigungu) {
        params.sigungu = selectedRegion || area.sigungu;
        if (selectedDong || area.emd) {
          params.emd = selectedDong || area.emd;
        }
      }
  
      const response = await axios.get(`/api/alba/search`, { params });
      setAlbaList(response.data);
      setHasNext(!response.data.last);
      console.log("dfkjkdfa",albaList.length);
      
      // URL 업데이트는 실제 검색어가 있을 때만
      if (searchTerm && searchTerm.trim() && !searchTerm.includes('구')) {
        navigate(`/alba?search=${searchTerm}`, { replace: true });
      } else if (!searchTerm || !searchTerm.trim()) {
        // 검색어가 없을 때는 search 파라미터 제거
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('search');
        window.history.replaceState({}, '', newUrl);
      }
    } catch (error) {
      console.error("검색 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  const id = sessionStorage.getItem('uid');

  const routes = [
    { path: "/", name: "홈" },
    { path: "/alba", name: "알바 검색" },
    { path: "/alba/create", name: "알바 게시물 작성" },
    { path: `/alba/${id}`, name: "알바 상세 보기" },
    { path: `/alba/${id}/edit`, name: "알바 게시물 수정" },
  ];


  useEffect(() => {
    // Toolbar에서 이동한 경우 자동 검색 실행
    if (location.state?.fromToolbar) {
        handleSearch('');
    }
  }, []);

  // 필터 상태가 변경될 때마다 자동으로 리스트 업데이트하는 useEffect 수정
  useEffect(() => {
    if (category !== 'all' || workType.length > 0 || workDays.length > 0 || 
        workTime.start || workTime.end) {
      handleSearch('');
    }
  }, [category, workType, workDays, workTime]);

  return (
    <>
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
<br/>
<h2>{`${searchFilter.sido} ${area.sigungu || searchFilter.sigungu} ${area.emd || ''} ${searchFilter.category === 'all' ? "" : searchFilter.category}`}{searchFilter.category === 'all' ? " 알바" : ""}</h2>

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
              {selectedDong ? 
                <RoundFilter title={selectedDong} variant='search' cancelIcon onClick={() => setSelectedDong("")} /> :
                selectedRegion && <RoundFilter title={selectedRegion} variant='search' cancelIcon onClick={() => setSelectedRegion("")} />
              }
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
          {(itemsToShow < albaList.length) && (
            <Button title="더보기" onClick={handleShowMore} />
          )}
                {/* 로그인 여부에 따라 글쓰기 버튼 렌더링 */}
          
          <Button 
            title="글쓰기" 
            variant="primary" 
            onClick={handleCreateButton} // 로그인 여부를 확인하고 렌더링
            
          />
          
      
          
        </ListContainer>
      </InnerContainer>
    </Container>
    <Modal title="로그인" isOpen={modalOpen === 'login'} onClose={() => setModalOpen('')}>
    <h3>알바를 등록하려면 로그인해야 해요.</h3>
    <div className="buttonWrap">
      <Button title="로그인" variant='primary' onClick={() => { setModalOpen(''); navigate("/login") }} />
      <Button title="닫기" onClick={() => setModalOpen('')} />
    </div>
  </Modal>
  </>
  );
}
