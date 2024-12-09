import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import FilterBar from "../../ui/FilterBar";
import CommunityListItem from "../../community/CommunityListItem"
import Button from "../../ui/Button";
import RoundFilter from "../../ui/RoundFilter";
import Radio from "../../ui/Radio";
import useGeolocation from "../../../utils/useGeolocation";
import { useJsApiLoader } from "@react-google-maps/api";
import Breadcrumb from "../../Breadcrumb";
import Modal from "../../ui/Modal";
import SearchBar from "../../ui/SearchBar";

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

export default function CommunityPage(props) {
  const navigate = useNavigate();
  const [communityList, setCommunityList] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [searchFilter, setSearchFilter] = useState({ sido: "부산광역시", sigungu: "", emd: "", category: "all", sort: "" });
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
    axios.get(`/api/data/filter?name=communityCategory`).then((response) => {
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
    setSearchFilter({ ...searchFilter, sido: currentLocation.sido, sigungu: currentLocation.sigungu });
  }, [currentLocation]);

  useEffect(() => {
    setLoading(true);
    if (searchFilter.sigungu) {
      fetchCommunityList(0);
    }
  }, [searchFilter]);


  useEffect(() => {
    setLoading(true);
    setSearchFilter({ ...searchFilter, emd: '' });
    getEmdList(searchFilter.sigungu);
    setIsFilterOpen(false);
  }, [searchFilter.sigungu, busanJuso]);

  const resetFilter = () => {
    setLoading(true);
    setSearchFilter({...searchFilter, sido: currentLocation.sido, sigungu: currentLocation.sigungu, emd: '', category: 'all', sort: ''});
    setIsFilterOpen(false);
    setPage(0);
  }

  const fetchCommunityList = async (page) => {
    try {
      const response = await axios.get(`api/community/search`, {
        params: {
          sigungu: searchFilter.sigungu,
          emd: searchFilter.emd,
          category: searchFilter.category,          
          page: page,
          size: 10,
        }
      });
      const newCommunityList = response.data.content;
      console.log(newCommunityList);
      setCommunityList((prevCommunities) => (page === 0 ? newCommunityList : [...prevCommunities, ...newCommunityList]));
      setHasNext(!response.data.last);
      setLoading(false);
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
    fetchCommunityList(page + 1);
    setPage(page + 1);
  };

  const handleCreateButton = () => {
    if (sessionStorage.getItem('uid')) {
      navigate("/community/write");
    } else {
      setModalOpen('login');
    }
  };

  const routes = [
    { path: "/", name: "홈" },
    { path: "/community", name: "동네생활" },
  ];

  return (
    <>
    <SearchBar/>
    <Breadcrumb routes={routes} />
    <Container>
      <HeadContainer>
      <h2>{`${searchFilter.sido} ${searchFilter.sigungu} ${searchFilter.emd} ${searchFilter.category === 'all' ? "" : searchFilter.category}`}{searchFilter.category === 'all' ? " 동네생활" : ""}</h2>
        <Button title="+ 글쓰기" variant="primary" onClick={handleCreateButton} />
      </HeadContainer>
      <InnerContainer>
        <FilterBar>
          <div className="filterItem">
            <h4 className="title" style={{ display: 'flex', width: '100%', gap: '8px', alignItems: 'center' }}>지역
              <CustomSelect value={searchFilter.sigungu} onChange={(e) => setSearchFilter({ ...searchFilter, sigungu: e.target.value })}>
                {busanJuso.map((item) => (
                  <option key={item.sigungu} value={item.sigungu}>{item.sigungu}</option>
                ))}
              </CustomSelect>
            </h4>

            <div className="filterList">
              <p>{searchFilter.sido}</p>
              <label className="radioWrap">
                <Radio name="gu" value={searchFilter.sigungu} checked={searchFilter.emd === ''} onChange={() => setSearchFilter({ ...searchFilter, emd: '' })} />
                {searchFilter.sigungu}
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
            <div className="filterList">
              <label className="radioWrap" onClick={() => setSearchFilter({...searchFilter, category: '인기글'})} style={{ fontWeight: searchFilter.category === '인기글' ? 'bold' : 'normal' }}>
                <img src="images/favorite.png" style={{ height: '20px', width: '20px', marginRight: '-6px' }} />
                인기글
              </label>
              <label className="radioWrap" onClick={() => setSearchFilter({...searchFilter, category: 'all'})} style={{ fontWeight: searchFilter.category === 'all' ? 'bold' : 'normal' }}>
                전체
              </label>
              {categoryData.map((item) => (
                <label key={item.name} className="radioWrap" onClick={() => setSearchFilter({...searchFilter, category: item.name})} style={{ fontWeight: item.name === searchFilter.category ? 'bold' : 'normal' }}>
                  {item.name}
                </label>
              ))}
            </div>
          </div>
        </FilterBar>

        <ListContainer>
          {(searchFilter.category !== 'all' || searchFilter.sort !== "") &&
            <FilterContainer>
              {searchFilter.category !== 'all' && <RoundFilter title={searchFilter.category} variant='search' cancelIcon onClick={() => setSearchFilter({...searchFilter, category: 'all'})} />}
              {searchFilter.sort !== "" && <RoundFilter title={searchFilter.sort === 'recent' ? '최신순' : '이름순'} variant='search' cancelIcon onClick={() => setSearchFilter({...searchFilter, sort: ''})} />}
            </FilterContainer>
          }


          {(!loading && communityList.length === 0) && <NoSearchResult>
            <h3>{`${searchFilter.emd ? searchFilter.emd : searchFilter.sigungu} 근처의 동네생활 글이 없어요.`}</h3>
            <p>다른 조건으로 검색하거나 첫 글을 써보세요.</p>
          </NoSearchResult>}
          {loading &&
            <LoadingText>
              <h3>동네생활 목록을 찾는 중이에요.</h3>
            </LoadingText>

          }

          {!loading && communityList?.map((community) => (
            <CommunityListItem key={community.id} community={community} />
          ))}
          {(!loading && hasNext) && <Button title="더보기" onClick={handleMoreButton} />}
        </ListContainer>

      </InnerContainer>

    </Container>

    <Modal title="로그인" isOpen={modalOpen === 'login'} onClose={() => setModalOpen('')}>
        <h3>동네생활을 작성하려면 로그인해야 해요.</h3>
        <div className="buttonWrap">
          <Button title="로그인" variant='primary' onClick={() => { setModalOpen(''); navigate("/login") }} />
          <Button title="닫기" onClick={() => setModalOpen('')} />
        </div>
      </Modal>

    </>
  );

}