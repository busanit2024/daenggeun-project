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
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [selectedRegion, setSelectedRegion] = useState(""); // 지역 선택 상태
  const [workType, setWorkType] = useState([]); // 근무 유형 필터
  const [category, setCategory] = useState("all"); // 카테고리 필터
  const [albaList, setAlbaList] = useState([]); // 알바 리스트 데이터
  const [categoryData, setCategoryData] = useState([]);
  const [workTypeData, setWorkTypeData] = useState([
    { id: 'longterm', name: '1개월 이상' },
    { id: 'shortterm', name: '단기' }
  ]);

  useEffect(() => {
    axios.get(`/api/data/filter?name=albaCategory`).then((response) => {
      setCategoryData(response.data.filters);
    })
      .catch((error) => {
        console.error("카테고리를 불러오는데 실패했습니다." + error);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/alba?gu=${selectedRegion}&category=${category}&workType=${workType.join(",")}&searchTerm=${searchTerm}`);
        setAlbaList(response.data);
      } catch (error) {
        console.error("알바 리스트를 불러오는데 실패했습니다." + error);
      }
    };
    fetchData();
  }, [selectedRegion, category, workType, searchTerm]);

  const resetFilter = () => {
    setSelectedRegion("");
    setCategory("all");
    setWorkType([]);
    setSearchTerm("");
  };

  const handleWorkTypeChange = (workTypeId) => {
    if (workType.includes(workTypeId)) {
      setWorkType(workType.filter(type => type !== workTypeId));
    } else {
      setWorkType([...workType, workTypeId]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  };

  return (
    <Container>
        <div className="search-bar">
            <select
              value={selectedRegion}
              onChange={handleRegionChange}
              className="region-filter"
            >
              <option value="">전체 지역</option>
              <option value="강남구">강남구</option>
              <option value="해운대구">해운대구</option>
            </select>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button>검색</button>
          </div>
      <HeadContainer>
        <h2>{`${selectedRegion} ${category === 'all' ? "" : category} 알바`}</h2>
        <Button title="알바 만들기" width onClick={() => navigate("/alba/create")} />
      </HeadContainer>
      <InnerContainer>
        <FilterBar>
          <div className="filterBarHeader">
            <h3 className="title">필터</h3>
            <div className="reset" onClick={resetFilter}>초기화</div>
          </div>
          
          <div className="filterItem">
            <h4 className="title">근무 유형</h4>
            <div className="filterList">
              {workTypeData.map((item) => (
                <div key={item._id}>
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
            <h4 className="title">하는일</h4>
            <div className="filterList">
              {categoryData.map((item) => (
                <div key={item.name}>
                  <input
                    type="radio"
                    id={item.name}
                    name="category"
                    value={item.name}
                    onChange={(e) => setCategory(e.target.value)}
                    checked={item.name === category}
                  />
                  <label htmlFor={item.name}>{item.name}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="filterItem">
            <h4 className="title">근무 요일</h4>
          </div>
          <div className="filterItem">
            <h4 className="title">근무 시간</h4>
          </div>

        </FilterBar>

        <ListContainer>
          {(category !== 'all' || workType.length > 0 || searchTerm !== "" || selectedRegion !== "") &&
            <FilterContainer>
              {category !== 'all' && <RoundFilter title={category} variant='search' cancelIcon onClick={() => setCategory('all')} />}
              {workType.map((type) => (
                <RoundFilter key={type} title={workTypeData.find(item => item.id === type)?.name} variant='search' cancelIcon onClick={() => handleWorkTypeChange(type)} />
              ))}
              {selectedRegion !== "" && <RoundFilter title={selectedRegion} variant='search' cancelIcon onClick={() => setSelectedRegion("")} />}
              {searchTerm !== "" && <RoundFilter title={`검색어: ${searchTerm}`} variant='search' cancelIcon onClick={() => setSearchTerm("")} />}
            </FilterContainer>
          }
          {albaList.length === 0 && <NoSearchResult>
            <h3>{`${selectedRegion || "해당 지역"} 근처에 알바가 없어요.`}</h3>
            <p>다른 조건으로 검색해주세요.</p>
          </NoSearchResult>}
          {albaList?.map((alba) => (
            <AlbaListItem key={alba.id} alba={alba} />
          ))}
          <Button title="더보기" />
        </ListContainer>
      </InnerContainer>
    </Container>
  );
}
