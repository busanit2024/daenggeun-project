import React, { useState } from "react";
import "../../styles/AlbaList.css";

const AlbaList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(""); // 지역 선택 상태

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  };

  return (
    <div className="alba-page">
      {/* 검색창 */}
      <div className="search-bar">
        {/* 지역 선택 필터 */}
        <select
          value={selectedRegion}
          onChange={handleRegionChange}
          className="region-filter"
        >
          <option value="">전체 지역</option>
          <option value="서울">서울</option>
          <option value="부산">부산</option>
          <option value="대구">대구</option>
          <option value="인천">인천</option>
          <option value="광주">광주</option>
          <option value="대전">대전</option>
          <option value="울산">울산</option>
          <option value="세종">세종</option>
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
          <label>
            <input type="checkbox" name="type" value="단기" />
            단기
          </label>
          <label>
            <input type="checkbox" name="type" value="장기" />
            장기
          </label>
          <h4>카테고리</h4>
          <label>
            <input type="checkbox" name="category" value="서빙" />
            서빙
          </label>
          <label>
            <input type="checkbox" name="category" value="매장관리" />
            매장관리
          </label>
        </aside>

        {/* 게시글 리스트 */}
        <div className="alba-list">
          <h3>게시글 리스트</h3>
          <div className="alba-item">
            <h4>서빙 알바 모집</h4>
            <p>위치: 서울 강남구</p>
            <p>시급: 12,000원</p>
            <p>근무 시간: 10:00 ~ 18:00</p>
          </div>
          <div className="alba-item">
            <h4>청소 알바 모집</h4>
            <p>위치: 부산 해운대구</p>
            <p>시급: 15,000원</p>
            <p>근무 시간: 14:00 ~ 20:00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbaList;
