import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import FilterBar from "../../ui/FilterBar";
import Button from "../../ui/Button";
import AlbaListItem from "../../alba/AlbaListItem";
import RoundFilter from "../../ui/RoundFilter";
import Breadcrumb from "../../Breadcrumb";
import SearchBar from "../../ui/SearchBar";  
import Radio from "../../ui/Radio";

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
  const [userLocation, setUserLocation] = useState([{ sigungu: "해운대구", emd: "" }]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDong, setSelectedDong] = useState("");
  const [workType, setWorkType] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
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
        const response = await axios.get(`/api/alba`, {
          params: {
            gu: selectedRegion || undefined,
            dong: selectedDong || undefined,
            category: selectedCategory !== "all" ? selectedCategory : undefined,
            workPeriod: workType.length > 0 ? workType.join(",") : undefined,
            workDays: workDays.length > 0 ? workDays.join(",") : undefined,
            start: workTime.start || undefined,
            end: workTime.end || undefined,
            searchTerm: searchTerm.trim() !== "" ? searchTerm : undefined,
          }
        });
        console.log(response.data)
        // 필터링 결과가 있는 경우에만 albaList를 업데이트
        const filteredList = response.data.filter(alba => {

          console.log("alba: ", alba);
          console.log("workTime.start: ", workTime.start);
          console.log("workTime.end: ", workTime.end);
          console.log("alba.workTimeStart >= workTime.start: ", '"' + alba.workTimeStart + '"' >= '"' + workTime.start + '"');
          console.log("alba.workTimeEnd <= workTime.end", '"' + alba.workTimeEnd + '"' >= '"' + workTime.end + '"');

          return (
            (!selectedRegion || alba.region === selectedRegion) &&
            (!selectedDong || alba.dong === selectedDong) &&
            (selectedCategory === "all" || alba.selectedCategory === selectedCategory) &&
            (workType.length === 0 || workType.includes(alba.workPeriod)) &&
            (workDays.length === 0 || workDays.every(day => alba.workDays.includes(day))) &&
            (!workTime.start || '"' + alba.workTimeStart + '"' >= '"' + workTime.start + '"') &&
            (!workTime.end || '"' + alba.workTimeEnd + '"' >= '"' + workTime.end + '"') &&
            (!searchTerm.trim() || alba.title.includes(searchTerm.trim()) || alba.description.includes(searchTerm.trim()))
          );
        });

        console.log("filteredList: ", filteredList)
        setAlbaList(filteredList);
      } catch (error) {
        console.error("알바 리스트를 불러오는데 실패했습니다." + error);
      }
    };
    fetchData();
  }, [selectedRegion, selectedDong, selectedCategory, workType, workDays, workTime, searchTerm]);


  const handleLocationSelect = (selectedLocation) => {
    const [sigungu, emd] = selectedLocation.split(",").map(loc => loc.trim());
    setSelectedRegion(sigungu);
    setSelectedDong(emd); 
    console.log("Selected Region:", sigungu);
    console.log("Selected Dong:", emd); 
};


  const resetFilter = () => {
    setSelectedRegion("");
    setSelectedDong("");
    setSelectedCategory("all");
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
    setSelectedCategory(e.target.value);
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
      (selectedCategory === "all" || alba.category === selectedCategory) &&
      (workType.length === 0 || workType.includes(alba.workPeriod)) &&
      (workDays.length === 0 || workDays.every(day => alba.workDays.includes(day))) &&
      (!workTime.start || alba.workTimeStart >= workTime.start) &&
      (!workTime.end || alba.workTimeEnd <= workTime.end) &&
      // 검색어 필터링
      (!searchTerm.trim() || alba.title.includes(searchTerm.trim()) || alba.description.includes(searchTerm.trim()))
    );
  });

  const routes = [
    { path: "/", name: "홈" },
    { path: "/alba", name: "알바 검색" },
    { path: "/alba/create", name: "알바 게시물 작성" },
    { path: "/alba/{id}", name: "알바 상세 보기" },
    { path: "/alba/{id}/edit", name: "알바 게시물 수정" },
  ];
  
  return (
    <Container>
      
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

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
                <div key={item.id}>
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
                <div key={item.name}>
                  <Radio
                    type="radio"
                    id={item.name}
                    name="category"
                    value={item.name}
                    onChange={handleCategoryChange}
                    checked={item.name === selectedCategory}
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

          {(selectedCategory !== 'all' || workType.length > 0 || workDays.length > 0 || workTime.start || workTime.end || searchTerm.trim() !== "" || selectedRegion !== "" || selectedDong !== "") &&
            <FilterContainer>
              {selectedCategory !== 'all' && <RoundFilter title={selectedCategory} variant='search' cancelIcon onClick={() => setSelectedCategory('all')} />}
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
