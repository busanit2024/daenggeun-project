import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Button from "./Button";
import useGeolocation from "../../utils/useGeolocation";
import { useJsApiLoader } from "@react-google-maps/api";
import { useArea } from "../../context/AreaContext";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-height: 80vh; 
  min-height: 475px;
  overflow-y: auto; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 3px;
`;

const StyledButton = styled(Button)`
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 4px;
`;

const Suggestions = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
`;

const SuggestionItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;

  &:hover {
    background: #f9f9f9;
  }
`;

const NoResultsMessage = styled.div`
  padding: 10px;
  text-align: center;
  color: #999;
`;

const MyLocationsContainer = styled.div`
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #E9EBF0;
`;

const MyLocationsTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
`;

const LocationsWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const LocationChip = styled.div`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid ${props => props.isActive ? '#FF7B07' : '#E9EBF0'};
  background: ${props => props.isActive ? '#FFF5ED' : 'white'};
  color: ${props => props.isActive ? '#FF7B07' : '#333'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;

  &:hover {
    background: #FFF5ED;
  }
`;

const libraries = ['places'];

const LocationSearchModal = ({ onSelect, onClose, onSearch }) => {
  const [locations, setLocations] = useState([]); // 지도 리스트
  const [busanJuso, setBusanJuso] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]); 
  const [userLocations, setUserLocations] = useState([]);
  const { area } = useArea();
  const uid = sessionStorage.getItem('uid');

  const { isLoaded: isJsApiLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
    language: 'ko',
    region: 'KR',
  });

  const currentLocation = useGeolocation(isJsApiLoaded);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`/api/data/filter?name=busanJuso`); 
        console.log("서버 응답:", response.data); 
        const locationFilters = response.data.locationFilters; 

        // 데이터 가공
        if (Array.isArray(locationFilters)) { 
          setBusanJuso(locationFilters); 

          const allLocations = locationFilters.flatMap(locationFilter => {
            if (locationFilter && locationFilter.sigungu) {
              return locationFilter.emd.map(e => ({
                sigungu: locationFilter.sigungu,
                emd: e.emd
              })); // Location 객체로 변환
            }
            return []; 
          });

          setLocations(allLocations); 
        } else {
          console.error("응답 데이터의 locationFilters가 배열이 아닙니다:", locationFilters);
          setLocations([]); 
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };

    fetchLocations();
  }, []); 

  // 검색어가 변경될 때마다 필터링된 위치 업데이트
  useEffect(() => {
    if (searchTerm) {
      const filtered = locations.filter(location => 
        location.sigungu.includes(searchTerm) || location.emd.includes(searchTerm)
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(locations);
    }
  }, [searchTerm, locations]);

  // 사용자 동네 정보 가져오기
  useEffect(() => {
    const fetchUserLocations = async () => {
      if (!uid) return;
      
      try {
        const response = await axios.get(`/user/${uid}`);
        if (response.data.location) {
          setUserLocations(response.data.location);
        }
      } catch (error) {
        console.error("동네 정보를 불러오는데 실패했습니다:", error);
      }
    };

    fetchUserLocations();
  }, [uid]);

  const handleLocationSelect = (selectedLocation) => {
    if(selectedLocation) {
      const [sigungu, emd] = selectedLocation.split(",").map(loc => loc.trim());
      onSelect(selectedLocation);  // 부모 컴포넌트에 위치만 전달
      onClose();  // 모달 닫기
    }
  };


  const findMyLocation = () => {
    if (!isJsApiLoaded) {
      console.error("Google Maps API가 로드되지 않았습니다.");
      return;
    }

    const { sigungu } = currentLocation; 
    console.log("현재 위치 :", sigungu);
  
    if (sigungu) {
      const locationFilter = busanJuso.find(item => item.sigungu === sigungu);
      
      if (locationFilter && locationFilter.emd) {
        const currentLocationEmds = locationFilter.emd.map(e => ({
          sigungu: sigungu,
          emd: e.emd
        }));
        setFilteredLocations(currentLocationEmds);
        
        setSearchTerm('');
      } else {
        console.error("해당 시군구에 대한 emd 리스트를 찾을 수 없습니다.");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
      const selectedLocation = filteredLocations[0]; 
      if (selectedLocation) {
        const selectedString = `${selectedLocation.sigungu}, ${selectedLocation.emd}`;
        onSelect(selectedString);
        onClose(); 
      }
    }
  };

  // 지역별 그룹화
  const groupedLocations = filteredLocations.reduce((acc, location) => {
    if (!acc[location.sigungu]) {
      acc[location.sigungu] = [];
    }
    acc[location.sigungu].push(location.emd);
    return acc;
  }, {});

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h3>지역 검색</h3>
        <SearchInput
          type="text"
          placeholder="우리 동네를 찾아보세요!"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />
        <StyledButton
          title="현재 내 위치 사용하기"
          onClick={findMyLocation}
          variant="findLocation"
          width="100%"
        />
          
        <Suggestions>
          {/* 기존 검색 결과 유지 */}
          {Object.keys(groupedLocations).length > 0 ? (
            Object.keys(groupedLocations).map((sigungu, index) => (
              <div key={index}>
                <SuggestionItem onClick={() => {
                  const selectedLocation = sigungu; 
                  onSelect(selectedLocation); 
                  onClose();
                }}>
                  {sigungu} 
                </SuggestionItem>
                {groupedLocations[sigungu].map((emd, emdIndex) => (
                  <SuggestionItem key={emdIndex} onClick={() => {
                    const selectedLocation = `${sigungu}, ${emd}`;
                    onSelect(selectedLocation);
                    onClose();
                  }}>
                    {`${sigungu}, ${emd}`} 
                  </SuggestionItem>
                ))}
              </div>
            ))
          ) : (
            <NoResultsMessage>일치하는 장소가 없습니다.</NoResultsMessage>
          )}
        </Suggestions>

        {/* 내 동네 목록 - 하단에 수평으로 표시 */}
        {uid && userLocations.length > 0 && (
          <MyLocationsContainer>
            <MyLocationsTitle>내 동네</MyLocationsTitle>
            <LocationsWrapper>
              {userLocations.map((location, index) => (
                <LocationChip
                  key={index}
                  isActive={area.sigungu === location.sigungu && area.emd === location.emd}
                  onClick={() => handleLocationSelect(`${location.sigungu}${location.emd ? `, ${location.emd}` : ''}`)}
                >
                  {location.sigungu}{location.emd ? ` ${location.emd}` : ''}
                  {area.sigungu === location.sigungu && area.emd === location.emd && (
                    <span>✓</span>
                  )}
                </LocationChip>
              ))}
            </LocationsWrapper>
          </MyLocationsContainer>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default LocationSearchModal;