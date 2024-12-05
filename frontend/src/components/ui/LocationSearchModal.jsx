import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
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

const LocationSearchModal = ({ onSelect }) => {
  const [query, setQuery] = useState(""); // 검색어
  const [locations, setLocations] = useState([]); // 추천 데이터

  // 추천 데이터 로드
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("/api/data/locations"); // 추천 데이터 요청
        setLocations(response.data);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };
    fetchLocations();
  }, []);

  // 검색어 필터링
  const filteredLocations = locations.filter((location) =>
    location.includes(query)
  );

  return (
    <div>
      <h3>지역 검색</h3>
      <SearchInput
        type="text"
        placeholder="지역이나 동네 이름을 입력하세요"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Suggestions>
        {filteredLocations.map((location, index) => (
          <SuggestionItem key={index} onClick={() => onSelect(location)}>
            {location}
          </SuggestionItem>
        ))}
      </Suggestions>
    </div>
  );
};

export default LocationSearchModal;
