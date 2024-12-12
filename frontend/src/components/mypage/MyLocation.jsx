import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ListContainer } from "../pages/Mypage/MyPageMain";
import LocationSearchModal from "../ui/LocationSearchModal";
import Button from "../ui/Button";
import axios from "axios";
import { useArea } from "../../context/AreaContext";

const LocationButtonsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
`;

const LocationButton = styled(Button)`
  flex: 1;
  height: 48px;
`;

export default function MyLocation() {
  const [locations, setLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);  // 현재 선택 중인 버튼의 인덱스
  const uid = sessionStorage.getItem('uid');
  const { setArea } = useArea();

  useEffect(() => {
    const fetchUserLocations = async () => {
      try {
        const response = await axios.get(`/user/${uid}`);
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

  return (
    <>
      <ListContainer>
        <h3>내 동네 설정</h3>
        <LocationButtonsContainer>
          <LocationButton
            variant={locations[0] ? "primary" : "gray"}
            title={locations[0] ? `${locations[0].sigungu}${locations[0].emd ? ` ${locations[0].emd}` : ''}` : "+ 동네 추가"}
            onClick={() => handleButtonClick(locations[0] ? 0 : null)}
          />
          <LocationButton
            variant={locations[1] ? "primary" : "gray"}
            title={locations[1] ? `${locations[1].sigungu}${locations[1].emd ? ` ${locations[1].emd}` : ''}` : "+ 동네 추가"}
            onClick={() => handleButtonClick(locations[1] ? 1 : null)}
          />
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
    </>
  );
}