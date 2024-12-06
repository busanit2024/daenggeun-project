import React from "react";
import RoundFilter from "./RoundFilter";
import SearchBox from "./MainSearch";
import styled from "styled-components";

const SearchWrapper = styled.div`
  display: flex;
  gap: 16px; 
  align-items: center; 
`;

const SearchBar = () => {
    return (
        <SearchWrapper>
            <RoundFilter variant="white" title="해운대구" />
            <SearchBox />
        </SearchWrapper>
    );    
};

export default SearchBar;