import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { ListContainer } from "../pages/Mypage/MyPageMain";
import LocationSearchModal from "../ui/LocationSearchModal";
import Button from "../ui/Button";
import axios from "axios";
import { useArea } from "../../context/AreaContext";
import Modal from "../ui/Modal";

const LocationButtonsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
`;

const LocationButton = styled(Button)`
  flex: 1;
  height: 48px;
  position: relative;
`;

const MapSection = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  margin-bottom: 24px;
  display: flex;
  gap: 16px;
`;

const MapWrapper = styled.div`
  flex: 1;
  border-radius: 8px 0 0 8px;
  border: 1px solid #ddd;
  border-right: none;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 160px;
  background: #fff;
  border-radius: 0 8px 8px 0;
  border: 1px solid #ddd;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  h4 {
    font-size: 14px;
    color: #666;
    margin: 0 0 8px 0;
    font-weight: 600;
  }
`;

const LocationText = styled.div`
  font-size: 14px;
  color: #666;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: #f8f8f8;
    color: #ff8a3d;
  }
`;

// 동 이름 형식을 통일하는 함수 추가
const normalizeEmdName = (emdName) => {
  if (!emdName) return '';
  
  // "제1" -> "1", "제2" -> "2" 변환
  return emdName
    .replace(/제(\d+)/g, '$1')  // "제1" -> "1"
    .replace(/(\d+)제/g, '$1')  // "1제" -> "1"
    .replace(/첫번째/g, '1')
    .replace(/두번째/g, '2')
    .replace(/세번째/g, '3');
};

export default function MyLocation() {
  const [locations, setLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [map, setMap] = useState(null);
  const uid = sessionStorage.getItem('uid');
  const { setArea } = useArea();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const onMapLoad = (map) => {
    setMap(map);
    
    try {
      const center = { lat: 35.1795, lng: 129.0756 };
      
      // 지도 옵션 설정
      map.setCenter(center);
      map.setZoom(11); 
      
      // 지도 이동 제한 설정
      const bounds = new window.google.maps.LatLngBounds(
        { lat: 34.8937, lng: 128.7432 }, 
        { lat: 35.3839, lng: 129.3147 }  
      );
      map.setOptions({
        restriction: {
          latLngBounds: bounds,
          strictBounds: false
        },
        minZoom: 11,  
        maxZoom: 15
      });

      // 기본 스타일 설정
      map.data.setStyle({
        fillColor: '#ffffff',
        fillOpacity: 0, 
        strokeWeight: 0,  
        strokeColor: 'transparent',
        strokeOpacity: 0
      });

      // GeoJSON 데이터 로드
      fetch('/data/hangjeongdong_busan.geojson')
        .then(response => response.json())
        .then(data => {
          console.log("GeoJSON 데이터 구조:", data.features.map(f => ({
            original: f.properties.adm_nm,
            split: f.properties.adm_nm.split(' ')
          })));
          map.data.addGeoJson(data);
          
          if (locations.length > 0) {
            locations.forEach(loc => {
              console.log("현재 선택된 위치:", {
                sigungu: loc.sigungu,
                emd: loc.emd,
                sigunguWithoutSuffix: loc.sigungu.replace(/[구군]$/, '')
              });
            });
          }
          updateMapStyles(map, locations);
        })
        .catch(error => {
          console.error("GeoJSON 데이터 로드 실패:", error);
        });

    } catch (error) {
      console.error("지도 초기화 실패:", error);
    }
  };

  const updateMapStyles = (map, locations) => {
    if (!map) return;
    
    map.data.setStyle(feature => {
      const fullName = feature.getProperty('adm_nm');
      const [sido, sgg, emd] = fullName.split(' ');
      const cleanSgg = sgg.replace(/[구군]$/, '');
      
      const isFirstLocation = locations[0] && 
        cleanSgg === locations[0].sigungu.replace(/[구군]$/, '') &&
        (!locations[0].emd || normalizeEmdName(emd) === normalizeEmdName(locations[0].emd));
      
      const isSecondLocation = locations[1] && 
        cleanSgg === locations[1].sigungu.replace(/[구군]$/, '') &&
        (!locations[1].emd || normalizeEmdName(emd) === normalizeEmdName(locations[1].emd));

      return {
        fillColor: isFirstLocation ? '#ff8a3d' : 
                  isSecondLocation ? '#ffd8b8' : 
                  '#ffffff',
        fillOpacity: isFirstLocation || isSecondLocation ? 0.5 : 0,
        strokeWeight: isFirstLocation || isSecondLocation ? 2 : 0,
        strokeColor: isFirstLocation || isSecondLocation ? '#ff8a3d' : 'transparent',
        strokeOpacity: isFirstLocation || isSecondLocation ? 1 : 0
      };
    });
  };

  useEffect(() => {
    updateMapStyles(map, locations);
  }, [map, locations]);

  useEffect(() => {
    const fetchUserLocations = async () => {
      try {
        const response = await axios.get(`/user/${uid}`);
        console.log("받아온 위치 데이터:", response.data.location);
        setLocations(response.data.location || []);
      } catch (error) {
        console.error("동네 정보를 불러오는데 실패했습니다:", error);
      }
    };

    if (uid) {
      fetchUserLocations();
    }
  }, [uid]);

  const handleLocationSelect = async (selectedLocation) => {
    const [sigungu, emd] = selectedLocation.split(",").map(loc => loc.trim());
    console.log('선택된 위치:', { sigungu, emd }); // 디버깅 추가
    
    if (locations.length >= 2 && selectedIndex === null) {
      alert("동네는 최대 2개까지만 설정할 수 있습니다.");
      return;
    }

    const newLocation = { sigungu, emd };
    let updatedLocations;
    
    if (selectedIndex !== null) {
      updatedLocations = locations.map((loc, idx) => 
        idx === selectedIndex ? newLocation : loc
      );
    } else {
      updatedLocations = [...locations, newLocation];
    }

    try {
      await axios.patch(`/user/${uid}/location`, {
        location: updatedLocations
      });
      setLocations(updatedLocations);
      
      if (selectedIndex === 0 || (!selectedIndex && updatedLocations.length === 1)) {
        setArea({ sigungu, emd });
      }
    } catch (error) {
      console.error("동네 설정에 실패했습니다:", error);
    }

    setIsModalOpen(false);
    setSelectedIndex(null);
  };

  const handleButtonClick = (index) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = async (index) => {
    setDeleteIndex(index);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const updatedLocations = locations.filter((_, idx) => idx !== deleteIndex);
      
      await axios.patch(`/user/${uid}/location`, {
        location: updatedLocations
      });
      
      setLocations(updatedLocations);
      
      if (deleteIndex === 0 && updatedLocations.length > 0) {
        const { sigungu, emd } = updatedLocations[0];
        setArea({ sigungu, emd });
      }
    } catch (error) {
      console.error("동네 삭제에 실패했습니다:", error);
    }
    
    setShowDeleteConfirm(false);
    setDeleteIndex(null);
  };

  return (
    <>
      <ListContainer>
        <h3>내 동네 설정하기</h3>
        <MapSection>
          <MapWrapper>
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={{ lat: 35.1795, lng: 129.0756 }}
                zoom={11}
                onLoad={onMapLoad}
              />
            </LoadScript>
          </MapWrapper>
          <Sidebar>
            <h4>설정된 동네</h4>
            {locations.length > 0 ? (
              locations.map((location, index) => (
                <LocationText
                  key={index}
                  onClick={() => {
                    if (map) {
                      console.log("이동하려는 위치:", location);
                      let found = false;
                      
                      map.data.forEach(feature => {
                        const fullName = feature.getProperty('adm_nm');
                        const [sido, sgg, dong] = fullName.split(' ');
                        const cleanSgg = sgg.replace(/[구군]$/, '');
                        const cleanLocation = location.sigungu.replace(/[구군]$/, '');
                        
                        // 동 이름 정규화 후 비교
                        const normalizedDong = normalizeEmdName(dong);
                        const normalizedEmd = normalizeEmdName(location.emd);
                        
                        if (cleanSgg === cleanLocation && 
                            (!location.emd || normalizedDong === normalizedEmd)) {
                          console.log("매칭된 지역 찾음:", {
                            original: fullName,
                            normalized: { dong: normalizedDong, emd: normalizedEmd }
                          });
                          found = true;
                          const bounds = new window.google.maps.LatLngBounds();
                          feature.getGeometry().forEachLatLng(latLng => bounds.extend(latLng));
                          map.panTo(bounds.getCenter());
                          map.setZoom(14);
                        }
                      });
                      
                      if (!found) {
                        console.log("매칭되는 지역을 찾지 못함:", {
                          sigungu: location.sigungu,
                          emd: location.emd,
                          normalizedEmd: normalizeEmdName(location.emd)
                        });
                      }
                    }
                  }}
                >
                  {location.sigungu}
                  {location.emd && ` ${location.emd}`}
                </LocationText>
              ))
            ) : (
              <LocationText style={{ color: '#999', cursor: 'default' }}>
                설정된 동네가 없습니다
              </LocationText>
            )}
          </Sidebar>
        </MapSection>
        <LocationButtonsContainer>
          {[0, 1].map((index) => (
            <LocationButton
              key={index}
              variant={locations[index] ? "primary" : "gray"}
              title={locations[index] ? 
                `${locations[index].sigungu}${locations[index].emd ? ` ${locations[index].emd}` : ''} ×` : 
                "+ 동네 추가"
              }
              onClick={(e) => {
                if (locations[index] && e.target.textContent.includes('×')) {
                  handleDelete(index);
                } else {
                  handleButtonClick(locations[index] ? index : null);
                }
              }}
            />
          ))}
        </LocationButtonsContainer>
      </ListContainer>

      {isModalOpen && (
        <LocationSearchModal 
          onSelect={handleLocationSelect}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedIndex(null);
          }}
        />
      )}

      {showDeleteConfirm && (
        <Modal 
          title="동네 삭제" 
          isOpen={showDeleteConfirm} 
          onClose={() => setShowDeleteConfirm(false)}
        >
          <h3>이 동네를 삭제하시겠습니까?</h3>
          <div className="buttonWrap">
            <Button title="삭제" variant="primary" onClick={confirmDelete} />
            <Button title="취소" onClick={() => setShowDeleteConfirm(false)} />
          </div>
        </Modal>
      )}
    </>
  );
}