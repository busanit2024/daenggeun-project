import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/AlbaCreate.css";
import axios from "axios";

const AlbaCreate = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "강서구", // 기본값 설정
    wage: "",
    workDays: [],
    startTime: "",
    endTime: "",
    image: null,
  });

  const navigate = useNavigate();

  // 입력값 변화 핸들러
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 체크박스 선택 핸들러 (근무 요일)
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      workDays: checked
        ? [...prev.workDays, value]
        : prev.workDays.filter((day) => day !== value),
    }));
  };

  // 이미지 업로드 핸들러
  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  // 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (key === "workDays") {
        form[key].forEach((day) => formData.append("workDays[]", day));
      } else {
        formData.append(key, form[key]);
      }
    });

    try {
      await axios.post("/api/alba", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch (error) {
      console.error("글 작성 중 오류 발생:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">알바 글 작성</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          name="title"
          placeholder="제목"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          className="textarea"
          name="description"
          placeholder="상세 내용"
          value={form.description}
          onChange={handleChange}
        ></textarea>

        {/* 위치 선택 드롭다운 */}
        <div className="location-section">
          <label htmlFor="location">위치</label>
          <select
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="dropdown"
          >
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
        </div>

        <input
          className="input"
          name="wage"
          placeholder="시급"
          value={form.wage}
          onChange={handleChange}
        />
        <div className="work-days">
          <h3>근무 요일</h3>
          {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                value={day}
                onChange={handleCheckboxChange}
              />
              {day}
            </label>
          ))}
        </div>
        <div className="work-time">
          <h3>근무 시간</h3>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
          />
          ~
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
          />
        </div>
        <div className="image-upload">
          <h3>이미지 업로드</h3>
          <input type="file" name="image" onChange={handleImageChange} />
        </div>
        <button className="button" type="submit">
          작성 완료
        </button>
      </form>
    </div>
  );
};

export default AlbaCreate;
