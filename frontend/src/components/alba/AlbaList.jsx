import React, { useState } from "react";
import "../../styles/AlbaList.css";

const AlbaList = () => {
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [selectedRegion, setSelectedRegion] = useState(""); // 지역 선택 상태

  // 가상 데이터
  const data = [
    {
      id: 1,
      title: "서빙 알바 모집",
      location: "서울 강남구",
      wage: "12,000원",
      workTime: "10:00 ~ 18:00",
    },
    {
      id: 2,
      title: "청소 알바 모집",
      location: "부산 해운대구",
      wage: "15,000원",
      workTime: "14:00 ~ 20:00",
    },
    {
      id: 3,
      title: "배달 알바 모집",
      location: "부산 동래구",
      wage: "13,000원",
      workTime: "09:00 ~ 17:00",
    },
  ];

  // 검색 및 필터링된 데이터 계산
  const filteredData = data.filter((item) => {
    const matchesSearchTerm =
      item.title.includes(searchTerm) || item.location.includes(searchTerm);
    const matchesRegion =
      selectedRegion === "" || item.location.includes(selectedRegion);

    return matchesSearchTerm && matchesRegion;
  });

  // 검색어 입력 핸들러
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 지역 선택 핸들러
  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
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
          <option value="강서구">강서구</option>
          <option value="금정구">금정구</option>
          <option value="기장군">기장군</option>
          <option value="남구">남구</option>
          <option value="동구">동구</option>
          <option value="동래구">동래구</option>
          <option value="부산진구">부산진구</option>
          <option value="북구">북구</option>
          <option value="사상구">사상구</option>
          <option value="사하구">사하구</option>
          <option value="서구">서구</option>
          <option value="수영구">수영구</option>
          <option value="연제구">연제구</option>
          <option value="영도구">영도구</option>
          <option value="중구">중구</option>
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

      {/* 제목 */}
      <div className="alba-title-container">
        <h5>홈 {'>'} 알바</h5>
        <h2 className="alba-title">부산광역시 동래구 알바</h2>
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
          <h4>하는일</h4>
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
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div className="alba-item" key={item.id}>
                <h4>{item.title}</h4>
                <p>{item.location} </p>
                <p>{item.wage}·{item.workTime}</p>
                <p></p>
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
