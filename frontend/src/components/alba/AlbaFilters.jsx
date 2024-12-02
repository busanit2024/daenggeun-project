import React from "react";
import "../../styles/AlbaFilters.css"; // CSS 경로 확인

const AlbaFilters = ({ onFilter }) => {
  const handleTypeChange = (event) => {
    const type = event.target.value;
    onFilter(type); // 부모 컴포넌트로 전달
  };

  return (
    <div className="filter-section">
      <h3>필터</h3>
      <div>
        <label>
          <input type="radio" name="type" value="장기" onChange={handleTypeChange} />
          1개월 이상
        </label>
        <label>
          <input type="radio" name="type" value="단기" onChange={handleTypeChange} />
          단기
        </label>
      </div>
      <div>
        <h4>하는 일</h4>
        <label>
          <input type="checkbox" value="서빙" />
          서빙
        </label>
        <label>
          <input type="checkbox" value="주방보조/설거지" />
          주방보조/설거지
        </label>
        <label>
          <input type="checkbox" value="주방장/조리사" />
          주방장/조리사
        </label>
        <label>
          <input type="checkbox" value="" />
          
        </label>
        <label>
          <input type="checkbox" value="" />
          
        </label>
        <label>
          <input type="checkbox" value="" />
          
        </label>
        <label>
          <input type="checkbox" value="" />
          
        </label>
        <label>
          <input type="checkbox" value="" />
          
        </label>
        <label>
          <input type="checkbox" value="" />
          
        </label>
        <label>
          <input type="checkbox" value="" />
          
        </label>
        <label>
          <input type="checkbox" value="" />
          
        </label>
        <label>
          <input type="checkbox" value="" />
          
        </label>
        <label>
          <input type="checkbox" value="" />
          
        </label>
        <label>
          <input type="checkbox" value="" />
          
        </label>
        <label>
          <input type="checkbox" value="기타" />
        기타  
        </label>
        
        {/* 필요한 체크박스 추가 */}
      </div>
      <button>필터 적용</button>
    </div>
  );
};

export default AlbaFilters;
