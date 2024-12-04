import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import FilterBar from "../../ui/FilterBar";
import Button from "../../ui/Button";
import GroupListItem from "../../group/GroupListItem";
import RoundFilter from "../../ui/RoundFilter";
import Radio from "../../ui/Radio";
import useGeolocation from "../../../utils/useGeolocation";
import { useJsApiLoader } from "@react-google-maps/api";

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


export default function GroupPage(props) {
  const navigate = useNavigate();
  const [groupList, setGroupList] = useState([]);
  const [location, setLocation] = useState({ sido: "부산광역시", sigungu: "해운대구", emd: "" });
  const [categoryData, setCategoryData] = useState([]);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");
  const [busanJuso, setBusanJuso] = useState([]);
  const [emdList, setEmdList] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { isLoaded: isJsApiLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
    language: 'ko',
    region: 'KR',
  });

  const currentLocation = useGeolocation(isJsApiLoaded);

  console.log(currentLocation);

  useEffect(() => {
    axios.get(`/api/data/filter?name=groupCategory`).then((response) => {
      setCategoryData(response.data.filters);
    })
      .catch((error) => {
        console.error("카테고리를 불러오는데 실패했습니다." + error);
      });

    axios.get(`/api/data/filter?name=busanJuso`).then((response) => {
      setBusanJuso(response.data.locationFilters);
    }).catch((error) => {
      console.error("부산 주소를 불러오는데 실패했습니다." + error);
    });
  }, []);

  useEffect(() => {
    setLocation({ ...location, sido: currentLocation.sido, sigungu: currentLocation.sigungu });
  }, [currentLocation]);

  useEffect(() => {
    fetchGroupList(0).then(() => setLoading(false));
  }, [location, category, sort]);


  useEffect(() => {
    setLocation({ ...location, emd: '' });
    getEmdList(location.sigungu);
    setIsFilterOpen(false);
  }, [location.sigungu, busanJuso]);

  const resetFilter = () => {
    setLocation(currentLocation);
    setCategory("all");
    setSort("");
    setIsFilterOpen(false);
    setPage(0);
  }

  const fetchGroupList = async (page) => {
    try {
      const response = await axios.get(`api/group/search`, {
        params: {
          sigungu: location.sigungu,
          emd: location.emd,
          category: category,
          sort: sort,
          page: page,
          size: 10,
        }
      });
      const newGroupList = response.data.content;
      setGroupList((prevGroups) => (page === 0 ? newGroupList : [...prevGroups, ...newGroupList]));
      setHasNext(!response.data.last);
    } catch (error) {
      console.error("모임 리스트를 불러오는데 실패했습니다." + error);
    }
  };



  const getEmdList = (gu) => {
    if (busanJuso && gu) {
      const emdList = busanJuso.find((item) => item.sigungu === gu)?.emd;
      const emdNameList = emdList?.map((item) => item.emd);
      setEmdList(emdNameList);
    }
  }

  const handleMoreButton = () => {
    fetchGroupList(page + 1);
    setPage(page + 1);
  };

  return (
    <Container>
      <HeadContainer>
        <h2>{`${location.sido} ${location.sigungu} ${location.emd} ${category === 'all' ? "" : category} 모임`}</h2>
        <Button title="모임 만들기" onClick={() => navigate("/group/create")} />
      </HeadContainer>
      <InnerContainer>
        <FilterBar>
          <div className="filterBarHeader">
            <h3 className="title">필터</h3>
            <div className="reset" onClick={resetFilter}>초기화</div>
          </div>
          <div className="filterItem">
            <h4 className="title" style={{ display: 'flex', width: '100%', gap: '8px', alignItems: 'center' }}>지역
              <CustomSelect value={location.sigungu} onChange={(e) => setLocation({ ...location, sigungu: e.target.value })}>
                {busanJuso.map((item) => (
                  <option key={item.sigungu} value={item.sigungu}>{item.sigungu}</option>
                ))}
              </CustomSelect>
            </h4>

            <div className="filterList">
              <p>{location.sido}</p>
              <label className="radioWrap">
                <Radio name="gu" value={location.sigungu} checked={location.emd === ''} onChange={() => setLocation({ ...location, emd: '' })} />
                {location.sigungu}
              </label>
              <EmdFilterWrap open={isFilterOpen}>
                {location.emd !== '' &&
                  <label className="radioWrap">
                    <Radio name="dong" value="" checked onChange={() => setLocation({ ...location, emd: '' })} />
                    {location.emd}
                  </label>
                }
                {(emdList && location.emd === '') && emdList.map((dong) => (
                  <label key={dong} className="radioWrap">
                    <Radio name="dong" value={dong} checked={location.emd === dong} onChange={() => setLocation({ ...location, emd: dong })} />
                    {dong}
                  </label>
                ))}
              </EmdFilterWrap>
              {
                (emdList && emdList.length > 5 && location.emd === '') &&
                <MoreFilterButton className="toggle" onClick={() => setIsFilterOpen(!isFilterOpen)}>{isFilterOpen ? "접기" : "더보기"}</MoreFilterButton>
              }

            </div>
          </div>
          <div className="filterItem">
            <h4 className="title">카테고리</h4>
            <div className="filterList">
              <label className="radioWrap">
                <Radio name="category" value="all" checked={category === 'all'} onChange={(e) => setCategory(e.target.value)} />
                전체
              </label>
              {categoryData.map((item) => (
                <label key={item.name} className="radioWrap">
                  <Radio name="category" value={item.name} checked={item.name === category} onChange={(e) => setCategory(e.target.value)} />
                  {item.name}
                </label>
              ))}
            </div>
          </div>
          <div className="filterItem">
            <h4 className="title">정렬</h4>
            <label className="radioWrap">
              <Radio name="sort" value="recent" checked={sort === 'recent'} onChange={(e) => setSort(e.target.value)} />
              최신순
            </label>
            <label className="radioWrap">
              <Radio name="sort" value="name" checked={sort === 'name'} onChange={(e) => setSort(e.target.value)} />
              이름순
            </label>

          </div>
        </FilterBar>

        <ListContainer>
          {(category !== 'all' || sort !== "") &&
            <FilterContainer>
              {category !== 'all' && <RoundFilter title={category} variant='search' cancelIcon onClick={() => setCategory('all')} />}
              {sort !== "" && <RoundFilter title={sort === 'recent' ? '최신순' : '이름순'} variant='search' cancelIcon onClick={() => setSort("")} />}
            </FilterContainer>
          }


          {(!loading && groupList?.length === 0) && <NoSearchResult>
            <h3>{`${location.emd ? location.emd : location.sigungu} 근처에 모임이 없어요.`}</h3>
            <p>다른 조건으로 검색해주세요.</p>
          </NoSearchResult>}
          {loading &&
            <LoadingText>
              <h3>모임을 찾는 중이에요.</h3>
            </LoadingText>

          }

          {groupList?.map((group) => (
            <GroupListItem key={group.id} group={group} />
          ))}
          {(!loading && hasNext) && <Button title="더보기" onClick={handleMoreButton} />}
        </ListContainer>

      </InnerContainer>

    </Container>
  );

}