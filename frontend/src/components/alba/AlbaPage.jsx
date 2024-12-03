import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import FilterBar from "../ui/FilterBar";
import Button from "../ui/Button";
import AlbaListItem from "./AlbaListItem";
import RoundFilter from "../ui/RoundFilter";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const InnerContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%; // 전체 높이로 사용하여 필터와 리스트 모두 볼 수 있게 함
  align-items: flex-start; // 시작 위치에 맞추어 수평 정렬
  gap: 20px; // 필터와 리스트 사이의 간격
  padding: 20px;
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

const FilterBarContainer = styled(FilterBar)`
  width: 240px; // 필터 바의 너비 고정
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

const SmallRoundFilter = styled(RoundFilter)`
  font-size: 5px; // 폰트 크기를 작게
  padding: 2px 4px; // 패딩을 줄여서 칩 크기 축소
  border-radius: 20px; // 모서리 반경을 줄여 칩 크기를 작게 만듦
`;

export default function AlbaPage(props) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [selectedRegion, setSelectedRegion] = useState(""); // 선택한 구 상태
  const [selectedDong, setSelectedDong] = useState(""); // 선택한 동 상태
  const [workType, setWorkType] = useState([]); // 근무 유형 필터
  const [category, setCategory] = useState("all"); // 카테고리 필터
  const [workDays, setWorkDays] = useState([]); // 근무 요일 필터
  const [workTime, setWorkTime] = useState({ start: "", end: "" }); // 근무 시간 필터
  const [albaList, setAlbaList] = useState([]); // 알바 리스트 데이터
  const [categoryData, setCategoryData] = useState([]);
  const [regionData, setRegionData] = useState([]); // 지역 필터 데이터
  const [workDaysData, setWorkDaysData] = useState([]); // 근무 요일 데이터
  const [workTypeData, setWorkTypeData] = useState([
    { id: 'longterm', name: '1개월 이상' },
    { id: 'shortterm', name: '단기' }
  ]);

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
    axios.get(`/api/data/filter?name=region-filter`)
      .then((response) => {
        setRegionData(response.data.filters);
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
  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/alba?gu=${selectedRegion}&dong=${selectedDong}&category=${category}&workType=${workType.join(",")}&workDays=${workDays.join(",")}&workTimeStart=${workTime.start}&workTimeEnd=${workTime.end}&searchTerm=${searchTerm}`);
      setAlbaList(response.data);
    } catch (error) {
      console.error("알바 리스트를 불러오는데 실패했습니다." + error);
    }
  };
    useEffect(() => {
      fetchData();
    }, [selectedRegion, selectedDong, category, workType, workDays, workTime, searchTerm]);
  
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

  // 근무 요일 필터를 핸들링하는 함수
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setSelectedDong(""); // 구가 변경될 때 동 선택 초기화
  };

  const handleDongChange = (e) => {
    setSelectedDong(e.target.value);
  };

  return (
    <Container>
      {/* 검색 바 */}
      <div className="search-bar">
        <select value={selectedRegion} onChange={handleRegionChange} className="region-filter">
          <option value="">전체 지역</option>
          {regionData.map((region) => (
            <option key={region.gu} value={region.gu}>{region.gu}</option>
          ))}
        </select>

        {selectedRegion && (
          <select value={selectedDong} onChange={handleDongChange} className="dong-filter">
            <option value="">전체 동</option>
            {regionData.find(region => region.gu === selectedRegion)?.dong.map((dong) => (
              <option key={dong} value={dong}>{dong}</option>
            ))}
          </select>
        )}

        <input type="text" placeholder="검색어를 입력하세요" value={searchTerm} onChange={handleSearchChange} />
        <button onClick={() => fetchData()}>검색</button>
      </div>

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
                  <input
                    type="checkbox"
                    id={item.id}
                    name="workType"
                    value={item.id}
                    onChange={() => handleWorkTypeChange(item.id)}
                    checked={workType.includes(item.id)}
                  />
                  <label htmlFor={item.id}>{item.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="filterItem">
            <h4 className="title">근무 요일</h4>
            <div className="filterList">
              {workDaysData.map((day) => (
                <SmallRoundFilter
                  key={day.name}
                  title={day.name}
                  variant={workDays.includes(day.name) ? 'selected' : 'category'}
                  onClick={() => handleWorkDayChange(day.name)}
                />
              ))}
            </div>
          </div>

          <div className="filterItem">
            <h4 className="title">근무 시간</h4>
            <div className="filterList">
              <div>
                <label htmlFor="workTimeStart">시작 시간: </label>
                <input type="time" id="workTimeStart" name="start" value={workTime.start} onChange={handleWorkTimeChange} />
              </div>
              <div>
                <label htmlFor="workTimeEnd">종료 시간: </label>
                <input type="time" id="workTimeEnd" name="end" value={workTime.end} onChange={handleWorkTimeChange} />
              </div>
            </div>
          </div>
        </FilterBarContainer>

        {/* 알바 리스트 컨테이너 */}
        <ListContainer>
          {(category !== 'all' || workType.length > 0 || workDays.length > 0 || workTime.start || workTime.end || searchTerm !== "" || selectedRegion !== "" || selectedDong !== "") &&
            <FilterContainer>
              {category !== 'all' && <RoundFilter title={category} variant='search' cancelIcon onClick={() => setCategory('all')} />}
              {workType.map((type) => (
                <RoundFilter key={type} title={workTypeData.find(item => item.id === type)?.name} variant='search' cancelIcon onClick={() => handleWorkTypeChange(type)} />
              ))}
              {workDays.map((day) => (
                <RoundFilter key={day} title={day} variant='search' cancelIcon onClick={() => handleWorkDayChange(day)} />
              ))}
              {workTime.start && <RoundFilter title={`시작 시간: ${workTime.start}`} variant='search' cancelIcon onClick={() => setWorkTime(prev => ({ ...prev, start: "" }))} />}
              {workTime.end && <RoundFilter title={`종료 시간: ${workTime.end}`} variant='search' cancelIcon onClick={() => setWorkTime(prev => ({ ...prev, end: "" }))} />}
              {selectedRegion && <RoundFilter title={selectedRegion} variant='search' cancelIcon onClick={() => setSelectedRegion("")} />}
              {selectedDong && <RoundFilter title={selectedDong} variant='search' cancelIcon onClick={() => setSelectedDong("")} />}
              {searchTerm && <RoundFilter title={`검색어: ${searchTerm}`} variant='search' cancelIcon onClick={() => setSearchTerm("")} />}
            </FilterContainer>
          }

          {albaList.length === 0 && (
            <NoSearchResult>
              <h3>{`${selectedRegion || "해당 지역"} 근처에 알바가 없어요.`}</h3>
              <p>다른 조건으로 검색해주세요.</p>
            </NoSearchResult>
          )}

          {albaList?.map((alba) => (
            <AlbaListItem key={alba.id} alba={alba} />
          ))}

          <Button title="더보기" />
        </ListContainer>
      </InnerContainer>
    </Container>
  );
}