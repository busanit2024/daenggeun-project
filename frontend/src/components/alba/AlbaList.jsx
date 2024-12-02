import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/AlbaStyled.css";

const AlbaList = () => {
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [selectedRegion, setSelectedRegion] = useState(""); // 지역 선택 상태
  const [selectedType, setSelectedType] = useState([]); // 근무 유형 필터
  const [selectedCategory, setSelectedCategory] = useState([]); // 카테고리 필터
  const [data, setData] = useState([]); // 게시글 데이터 상태
  const navigate = useNavigate();

  // 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/alba"); // API 호출
        setData(response.data);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };
    fetchData();
  }, []);

  // 검색 및 필터링된 데이터 계산
  const filteredData = data.filter((item) => {
    const matchesSearchTerm =
      item.title.includes(searchTerm) || item.location.includes(searchTerm);
    const matchesRegion =
      selectedRegion === "" || item.location.includes(selectedRegion);
    const matchesType =
      selectedType.length === 0 || selectedType.includes(item.type);
    const matchesCategory =
      selectedCategory.length === 0 || selectedCategory.includes(item.category);

    return (
      matchesSearchTerm && matchesRegion && matchesType && matchesCategory
    );
  });

  // 검색어 입력 핸들러
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 지역 선택 핸들러
  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  };

  // 필터 핸들러
  const handleFilterChange = (e, filterType) => {
    const value = e.target.value;
    const checked = e.target.checked;

    if (filterType === "type") {
      setSelectedType((prev) =>
        checked ? [...prev, value] : prev.filter((item) => item !== value)
      );
    } else if (filterType === "category") {
      setSelectedCategory((prev) =>
        checked ? [...prev, value] : prev.filter((item) => item !== value)
      );
    }
  };

  // 상세 페이지 이동 핸들러
  const handleClick = (id) => {
    navigate(`/alba/${id}`);
  };

  return (
    <div className="alba-page">
      {/* 검색창 */}
      <div className="search-bar">
        <select
          value={selectedRegion}
          onChange={handleRegionChange}
          className="region-filter"
        >
          <option value="">전체 지역</option>
          <option value="강남구">강남구</option>
          <option value="해운대구">해운대구</option>
        </select>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button>검색</button>
      </div>

      <div className="alba-content">
        {/* 필터 섹션 */}
        <aside className="filter-section">
          <h3>필터</h3>
          <h4>근무 유형</h4>
          <label>
            <input
              type="checkbox"
              value="단기"
              onChange={(e) => handleFilterChange(e, "type")}
            />
            단기
          </label>
          <label>
            <input
              type="checkbox"
              value="장기"
              onChange={(e) => handleFilterChange(e, "type")}
            />
            장기
          </label>
          <h4>하는 일</h4>
          <label>
            <input
              type="checkbox"
              value="서빙"
              onChange={(e) => handleFilterChange(e, "category")}
            />
            서빙
          </label>
          <label>
            <input
              type="checkbox"
              value="청소"
              onChange={(e) => handleFilterChange(e, "category")}
            />
            청소
          </label>
          <label>
            <input
              type="checkbox"
              value="배달"
              onChange={(e) => handleFilterChange(e, "category")}
            />
            배달
          </label>
        </aside>

        {/* 게시글 리스트 */}
        <div className="alba-list">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                className="alba-item"
                key={item._id}
                onClick={() => handleClick(item.id)}
              >
                <h4>{item.title}</h4>
                <p>위치: {item.location}</p>
                <p>시급: {item.wage}</p>
                <p>
                  근무 시간: {item.workTime.start} ~ {item.workTime.end}
                </p>
                <p>근무 요일: {item.workDays.join(", ")}</p>
              </div>
            ))
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbaList;
