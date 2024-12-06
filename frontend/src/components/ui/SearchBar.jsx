import React, { useState } from "react";
import RoundFilter from "./RoundFilter";
import MainSearchBox from "./MainSearchBox";
import styled from "styled-components";
import LocationSearchModal from "./LocationSearchModal";

const SearchWrapper = styled.div`
  display: flex;
  gap: 16px; 
  align-items: center;
   
`;

const StyledRoundFilter = styled(RoundFilter)`
    white-space: nowrap; 
    
`;

const SearchBar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userLocation, setUserLocation] = useState([{ sigungu: "해운대구", emd: "" }]);

    const handleLocationSelect = (selectedLocation) => {
        if (typeof selectedLocation === 'string') {
            const [sigungu, emd] = selectedLocation.split(",").map(loc => loc.trim());
            
            const locationObject = {
                sigungu: sigungu,
                emd: emd
            };

            setUserLocation([locationObject]);
            setIsModalOpen(false); 
        } else {
            console.error("선택된 위치가 문자열이 아닙니다:", selectedLocation);
        }
    };

    return (
        <SearchWrapper>
            <StyledRoundFilter 
                LocationIcon 
                variant="location" 
                title={`${userLocation[0].sigungu}${userLocation[0].emd ? `, ${userLocation[0].emd}` : ''}`} 
                onClick={() => setIsModalOpen(true)} />
            {isModalOpen && (
                <LocationSearchModal onSelect={handleLocationSelect} onClose={() => setIsModalOpen(false)} />
            )}
            <MainSearchBox />
        </SearchWrapper>
    );    
};

export default SearchBar;