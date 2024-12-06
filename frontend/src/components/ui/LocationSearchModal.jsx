import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Button from "./Button";
import useGeolocation from "../../utils/useGeolocation";
import { useJsApiLoader } from "@react-google-maps/api";

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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top:3px;
`;

const StyledButton =styled(Button)`
  width : 100%;
  padding : 10px;
  margin-bottom : 15px;
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

const LocationSearchModal = ({ onSelect, onClose }) => {
  const [locations, setLocations] = useState([]); // 지도 리스트
  const [ busanJuso, setBusanJuso] = useState([]);
  
  const { isLoaded: isJsApiLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
    language: 'ko',
    region: 'KR',
  });

  const currentLocation = useGeolocation(isJsApiLoaded);

  

  // 컴포넌트가 마운트될 때 데이터 요청
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`/api/data/filter?name=busanJuso`); 
        console.log("서버 응답:", response.data); 
        const locationFilters = response.data.locationFilters; // 서버에서 받은 데이터의 locationFilters 추출
    
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
            return []; // null 또는 유효하지 않은 경우 빈 배열 반환
          });
    
          setLocations(allLocations.slice(0,10)); 
        } else {
          console.error("응답 데이터의 locationFilters가 배열이 아닙니다:", locationFilters);
          setLocations([]); // 배열이 아닐 경우 결과 초기화
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };

    fetchLocations();
  }, []); // 컴포넌트가 처음 마운트될 때만 실행


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
        setLocations(locationFilter.emd.map(e => ({
          sigungu: sigungu,
          emd: e.emd
        })));
      } else {
        console.error("해당 시군구에 대한 emd 리스트를 찾을 수 없습니다.");
      }
    }
  };


  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h3>지역 검색</h3>
        <SearchInput
          type="text"
          placeholder="지역이나 동네 이름을 입력하세요"
        />
        <StyledButton
          title="현재 내 위치 사용하기"
          onClick={findMyLocation}
          variant="findLocation"
        />
          
        <Suggestions>
          {locations.map((location, index) => (
            <SuggestionItem key={index} onClick={() => {
              const selectedLocation = `${location.sigungu}, ${location.emd}`; // 문자열로 변환
              onSelect(selectedLocation); // 선택한 지역을 부모 컴포넌트에 전달
              setLocations([]); // 선택 후 결과 초기화
            }}>
              {`${location.sigungu}, ${location.emd}`} {/* 시군구와 읍면동 표시 */}
            </SuggestionItem>
          ))}
        </Suggestions>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LocationSearchModal;