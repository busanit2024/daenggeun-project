import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const SearchBoxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #dcdcdc;
  height: 50px;
  position: relative;
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const FilterButton = styled.button`
  background-color: transparent;
  padding: 10px 20px; 
  font-size: 14px;
  border-radius: 30px;
  cursor: pointer;
  color: black;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none; 
  white-space: nowrap; 
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 115%;
  left: 0;
  width: auto;
  min-width: 10%;
  background-color: white;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const DropdownItem = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  border-left: 1px solid #dcdcdc;
  padding-left: 16px; 
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 16px;
  border: none;
  border-radius: 30px;
  font-size: 14px;
  background-color: #f7f7f7;
  height: 40px;
`;

const SearchButton = styled.button`
  background-color: white;
  border: none;
  cursor: pointer;
  padding: 6px 12px; 
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
  svg {
    width: 18px; 
    height: 18px;
    fill: black;
  }
`;

const MainSearchBox = ({ searchTerm, setSearchTerm, selectedCategory }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [category, setCategory] = useState(selectedCategory);
    const navigate = useNavigate();

    const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

    const handleCategorySelect = (category) => {
      setCategory(category);
      setIsDropdownOpen(false); 
    };

    const handleSearch = () => {
        if (category === "중고거래") {
            navigate(`/usedTrade/used-trade?search=${searchTerm}`);
        } else if (category === "알바") {
            navigate(`/alba?search=${searchTerm}`);
        } else if (category === "동네생활") {
            navigate(`/community?search=${searchTerm}`);
        }
    }

    return (
        <SearchBoxWrapper>
            <FilterSection>
                <FilterButton onClick={toggleDropdown}>
                    {selectedCategory}
                </FilterButton>
                {isDropdownOpen && (
                    <DropdownMenu>
                        <DropdownItem onClick={() => handleCategorySelect("중고거래")}>중고거래</DropdownItem>
                        <DropdownItem onClick={() => handleCategorySelect("알바")}>알바</DropdownItem>
                        <DropdownItem onClick={() => handleCategorySelect("동네생활")}>동네생활</DropdownItem>
                    </DropdownMenu>
                )}
            </FilterSection>
            <SearchInputWrapper>
                <SearchInput 
                    type="search" 
                    placeholder="검색어를 입력해주세요"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }} 
                />
                <SearchButton type="submit" onClick={handleSearch}>
                    <svg viewBox="0 0 24 24">
                        <g>
                            <path
                                d="M10.5 2C5.80558 2 2 5.80558 2 10.5C2 15.1944 5.80558 19 10.5 19C12.4869 19 14.3145 18.3183 15.7618 17.176L20.2929 21.7071C20.6834 22.0976 21.3166 22.0976 21.7071 21.7071C22.0976 21.3166 22.0976 20.6834 21.7071 20.2929L17.176 15.7618C18.3183 14.3145 19 12.4869 19 10.5C19 5.80558 15.1944 2 10.5 2ZM4 10.5C4 6.91015 6.91015 4 10.5 4C14.0899 4 17 6.91015 17 10.5C17 14.0899 14.0899 17 10.5 17C6.91015 17 4 14.0899 4 10.5Z"
                                fill="currentColor"
                            />
                        </g>
                    </svg>
                </SearchButton>
            </SearchInputWrapper>
        </SearchBoxWrapper>
    );
};

export default MainSearchBox;