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
import Breadcrumb from "../../Breadcrumb";
import Modal from "../../ui/Modal";

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

const libraries = ['places'];

export default function GroupPage(props) {
  const navigate = useNavigate();
  const [groupList, setGroupList] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [searchFilter, setSearchFilter] = useState({
    sido: "부산광역시",
    sigungu: "",
    emd: "",
    category: "all",
    sort: "",
    uid: '',
  });
  const [busanJuso, setBusanJuso] = useState([]);
  const [emdList, setEmdList] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState('');

  const { isLoaded: isJsApiLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
    language: 'ko',
    region: 'KR',
  });

  const currentLocation = useGeolocation(isJsApiLoaded);

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
    console.log(currentLocation);
    if (currentLocation.sido && currentLocation.sigungu) {
      setSearchFilter((prev) => ({ ...prev, sido: currentLocation.sido, sigungu: currentLocation.sigungu }));
    }
  }, [currentLocation.sigungu]);

  useEffect(() => {
    setLoading(true);
    if (categoryData.length > 0 && busanJuso.length > 0 ) {
    fetchGroupList(0);
    }
  }, [searchFilter]);

  useEffect(() => {
    setLoading(true);
    setSearchFilter((prev) => ({ ...prev, emd: '' }));
    getEmdList(searchFilter.sigungu);
    setIsFilterOpen(false);
  }, [searchFilter.sigungu, busanJuso]);

  const resetFilter = () => {
    setLoading(true);
    setSearchFilter((prev) => ({ ...prev, sido: currentLocation.sido, sigungu: currentLocation.sigungu, emd: '', category: 'all', sort: '', uid: '' }));
    setIsFilterOpen(false);
    setPage(0);
  }

  const handleMyGroupFilter = () => {
    if (sessionStorage.getItem('uid')) {
      setSearchFilter({ ...searchFilter, sigungu: '', emd: '', category: 'all', sort: '', uid: sessionStorage.getItem('uid') });
    }
  }


  const fetchGroupList = async (page) => {
    try {
      const response = await axios.get(`api/group/search`, {
        params: {
          uid: searchFilter.uid,
          sigungu: searchFilter.sigungu,
          emd: searchFilter.emd,
          category: searchFilter.category,
          sort: searchFilter.sort,
          page: page,
          size: 10,
        }
      });
      const newGroupList = response.data.content;
      console.log(newGroupList);
      setGroupList((prevGroups) => (page === 0 ? newGroupList : [...prevGroups, ...newGroupList]));
      setHasNext(!response.data.last);
      setLoading(false);
    } catch (error) {
      console.error("모임 리스트를 불러오는데 실패했습니다." + error);
      setLoading(false);
    }
  };



  const getEmdList = (gu) => {
    if (busanJuso) {
      if (!gu) {
        setEmdList([]);
        console.log(searchFilter)
      } else {
        const emdList = busanJuso.find((item) => item.sigungu === gu)?.emd;
        const emdNameList = emdList?.map((item) => item.emd);
        setEmdList(emdNameList);
      }
    }
  }

  const handleMoreButton = () => {
    fetchGroupList(page + 1);
    setPage(page + 1);
  };

  const handleCreateButton = () => {
    if (sessionStorage.getItem('uid')) {
      navigate("/group/create");
    } else {
      setModalOpen('login');
    }
  };


  const routes = [
    { path: "/", name: "홈" },
    { path: "/group", name: "모임" },
  ];

  return (
    <>
      <Breadcrumb routes={routes} />
      <Container>
        <HeadContainer>
          <h2>{`${searchFilter.sido} ${searchFilter.sigungu} ${searchFilter.emd} ${searchFilter.uid ? '나의' : ''} ${searchFilter.category === 'all' ? "" : searchFilter.category} 모임`}</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button title="내 모임" onClick={handleMyGroupFilter} />
            <Button title="모임 만들기" variant="primary" onClick={handleCreateButton} />
          </div>
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
              <div className="filterList">
                <label className="radioWrap">
                  <Radio name="category" value="all" checked={searchFilter.category === 'all'} onChange={(e) => setSearchFilter({ ...searchFilter, category: e.target.value })} />
                  전체
                </label>
                {categoryData.map((item) => (
                  <label key={item.name} className="radioWrap">
                    <Radio name="category" value={item.name} checked={item.name === searchFilter.category} onChange={(e) => setSearchFilter({ ...searchFilter, category: e.target.value })} />
                    {item.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="filterItem">
              <h4 className="title">정렬</h4>
              <label className="radioWrap">
                <Radio name="sort" value="recent" checked={searchFilter.sort === 'recent'} onChange={(e) => setSearchFilter({ ...searchFilter, sort: e.target.value })} />
                최신순
              </label>
              <label className="radioWrap">
                <Radio name="sort" value="name" checked={searchFilter.sort === 'name'} onChange={(e) => setSearchFilter({ ...searchFilter, sort: e.target.value })} />
                이름순
              </label>

            </div>
          </FilterBar>

          <ListContainer>
            {(searchFilter.category !== 'all' || searchFilter.sort !== "" || searchFilter.uid) &&
              <FilterContainer>
                {searchFilter.category !== 'all' && <RoundFilter title={searchFilter.category} variant='search' cancelIcon onClick={() => setSearchFilter({ ...searchFilter, category: 'all' })} />}
                {searchFilter.sort !== "" && <RoundFilter title={searchFilter.sort === 'recent' ? '최신순' : '이름순'} variant='search' cancelIcon onClick={() => setSearchFilter({ ...searchFilter, sort: '' })} />}
                {searchFilter.uid && <RoundFilter title="내 모임" variant='search' cancelIcon onClick={() => setSearchFilter({ ...searchFilter, uid: '' })} />}
              </FilterContainer>
            }


            {(!loading && groupList.length === 0) && <NoSearchResult>
              <h3>{`${searchFilter.emd ? searchFilter.emd : searchFilter.sigungu} 근처에 모임이 없어요.`}</h3>
              <p>다른 조건으로 검색해주세요.</p>
            </NoSearchResult>}
            {loading &&
              <LoadingText>
                <h3>모임을 찾는 중이에요.</h3>
              </LoadingText>

            }

            {!loading && groupList?.map((group) => (
              <GroupListItem key={group.id} group={group} />
            ))}
            {(!loading && hasNext) && <Button title="더보기" onClick={handleMoreButton} />}
          </ListContainer>

        </InnerContainer>

      </Container>

      <Modal title="로그인" isOpen={modalOpen === 'login'} onClose={() => setModalOpen('')}>
        <h3>모임을 만들려면 로그인해야 해요.</h3>
        <div className="buttonWrap">
          <Button title="로그인" variant='primary' onClick={() => { setModalOpen(''); navigate("/login") }} />
          <Button title="닫기" onClick={() => setModalOpen('')} />
        </div>
      </Modal>

    </>
  );

}