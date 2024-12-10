import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import useGeolocation from "../../../utils/useGeolocation";
import { useJsApiLoader } from "@react-google-maps/api";
import Breadcrumb from "../../Breadcrumb";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import styled from "styled-components";
import FilterBar from "../../ui/FilterBar";
import SearchBar from "../../ui/SearchBar";
import { useLocation } from "react-router-dom";
import { elapsedText } from "../../../utils/elapsedText";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TextContainer = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  font-size: 20px;
  font-style: normal;
  margin: 0;
`;

const Content = styled.p`
  font-size: 15px;
  margin: 0;

  display: -webkit-box;
  // -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const InnerContainer = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
`;

const TagContainer = styled.div`
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666666;

  & span {
    display: flex;
    align-items: center;
    gap: 2px;
  }
`;

const ImageContainer = styled.div`

`
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const ProfileImage = styled.div`
  width: 48px;
  height: 48px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #dcdcdc;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .name-wrap {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .name {
    font-size: 16px;
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .nickname {
    color: #666666;
  }

  .location {
    color: #666666;
  }

  .desc {
    color: #666666;
  }

`;


const libraries = ['places'];

export default function CommunityViewPage(props) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchFilter, setSearchFilter] = useState({ sido: "부산광역시", sigungu: "", emd: "", category: "all", sort: "" });
    const [categoryData, setCategoryData] = useState([]);
    const [busanJuso, setBusanJuso] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [emdList, setEmdList] = useState([]);
    const { communityId } = useParams();
    const [community, setCommunity] = useState({});
    const { isLoaded: isJsApiLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
        language: 'ko',
        region: 'KR',
      });

    const currentLocation = useGeolocation(isJsApiLoaded);

    const { member } = props;
    const naviagte = useNavigate();
    const location = useLocation();
  
    const handleClick = () => {
      const currentPath = location.pathname;
      const myId = sessionStorage.getItem('uid');
      if (member?.userId === myId) {
        naviagte('my');
      } else if (currentPath.endsWith("members")) {
        naviagte(`${currentPath}/${member?.userId}`);
      } else {
        naviagte(`members/${member?.userId}`);
      }
    }
    

    useEffect(() => {
        fetchPost();
    }, [communityId]);
    
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

    const fetchPost = () => {
      axios.get(`/api/community/view/${communityId}`).then((response) => {
        setCommunity(response.data);
        console.log(response.data);
    })
    .catch((error) => {
        console.error("동네생활 정보를 불러오는데 실패했습니다." + error);
    });
  };

    useEffect(() => {
    setLoading(true);
    if (searchFilter.sigungu) {
        fetchPost();
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

    const getEmdList = (gu) => {
        if (busanJuso && gu) {
          const emdList = busanJuso.find((item) => item.sigungu === gu)?.emd;
          const emdNameList = emdList?.map((item) => item.emd);
          setEmdList(emdNameList);
        }
      };

    const routes = [
    { path: "/community", name: "동네생활" },
    { path: `/community/${community.id}`, name: community.category },
    ];

    return (
        <>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Breadcrumb routes={routes} />
        <Container>
            <InnerContainer>
                <FilterBar>
                <div className="filterItem">
                    <div className="filterList">
                    <label className="radioWrap" onClick={() => setSearchFilter({...searchFilter, category: '인기글'})} style={{ fontWeight: searchFilter.category === '인기글' ? 'bold' : 'normal' }}>
                        <img src="/images/favorite.png" style={{ height: '20px', width: '20px', marginRight: '-6px' }} />
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
                <TextContainer>
                <Wrapper>
                <ProfileImage>
                  {<img src={member?.profileImage?.url ?? '/images/defaultProfileImage.png'} alt={member?.name} onError={(e) => e.target.src = '/images/defaultProfileImage.png'}/>}
                </ProfileImage>
                <MemberInfo>
                  <div className="name-wrap">
                    <div className="name">{member?.username ?? '이름'}</div>
                  </div>
                  <TagContainer>
                    <span>
                      <img height={16} src="/images/icon/location_gray.svg" alt="location" />
                      {community.location?.emd ?? community.location?.sigungu ?? '위치 정보 없음'}
                    </span>
                    <span> · </span>
                    {elapsedText(new Date(community.createdDate))}
                  </TagContainer>
                </MemberInfo>
                </Wrapper>
                  <Title>{community.title}</Title>
                  <Content>{community.content}</Content>
                  <ImageContainer>
                    {community.images && community.images.length > 0 
                    && community.images.map((image, index) => (
                      <img 
                        key={index}
                        src={image.url}
                        alt={`Image ${index + 1}`}
                        style={{ width: "80%", height: "80%" }}
                      />
                    ))
                  }
                </ImageContainer>
                </TextContainer>
            </InnerContainer>
        </Container>
        </>
    );
}