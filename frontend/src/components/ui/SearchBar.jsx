import React, { useState } from "react";
import RoundFilter from "./RoundFilter";
import MainSearchBox from "./MainSearchBox";
import styled from "styled-components";
import LocationSearchModal from "./LocationSearchModal";
import { useArea } from "../../context/AreaContext";

const SearchWrapper = styled.div`
  display: flex;
  gap: 16px; 
  align-items: center;
   
`;

const StyledRoundFilter = styled(RoundFilter)`
    white-space: nowrap; 
    
`;

const SearchBar = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, onSelect , onSearch}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userLocation, setUserLocation] = useState([{ sigungu: "해운대구", emd: "" }]);
    const { area, setArea } = useArea();

    const handleLocationSelect = (selectedLocation) => {
        if (typeof selectedLocation === 'string') {
            const [sigungu, emd] = selectedLocation.split(",").map(loc => loc.trim());
        
            setArea({ sigungu, emd }); 
            setIsModalOpen(false);
            onSelect(selectedLocation); 

            if (typeof onSearch === 'function') {
                onSearch(sigungu, emd);
            } else {
                console.error("onSearch는 함수가 아닙니다.");
            }
        } else {
            console.error("선택된 위치가 문자열이 아닙니다:", selectedLocation);
        }
    };

    return (
        <SearchWrapper>
            <StyledRoundFilter 
                LocationIcon 
                variant="location" 
                title={`${area.sigungu}${area.emd ? `, ${area.emd}` : ''}`}
                onClick={() => setIsModalOpen(true)} />
            {isModalOpen && (
                <LocationSearchModal 
                    onSelect={handleLocationSelect} 
                    onClose={() => setIsModalOpen(false)} 
                    onSearch={onSearch} 
                />
            )}
            <MainSearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} 
                selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} 
                onSelect={handleLocationSelect} onSearch={onSearch}/>
        </SearchWrapper>
    );    
};

export default SearchBar;