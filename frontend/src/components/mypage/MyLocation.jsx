import React, { useState, useEffect } from "react";
import styled from "styled-components";
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

export default function MyLocation() {
  const [locations, setLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const uid = sessionStorage.getItem('uid');
  const { setArea } = useArea();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

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