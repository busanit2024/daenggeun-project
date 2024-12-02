import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import InputText from "../ui/InputText";
import "../../styles/AlbaStyled.css"; // 올바른 CSS 파일 경로
import axios from "axios";
import { LOCATIONS, DAYS } from "../../constants"; // 상수 가져오기

const AlbaCreate = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    wage: "",
    workDays: [],
    startTime: "",
    endTime: "",
    image: null,
  });

  const navigate = useNavigate();

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      workDays: checked
        ? [...prev.workDays, value]
        : prev.workDays.filter((day) => day !== value),
    }));
  };

  // 이미지 변경 핸들러
  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  // 폼 제출 핸들러
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
      alert("글이 성공적으로 작성되었습니다!");
      navigate("/alba");
    } catch (error) {
      console.error("글 작성 중 오류 발생:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">알바 글 작성</h1>
      <form className="form" onSubmit={handleSubmit}>
        <InputText
          name="title"
          placeholder="제목"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="상세 내용"
          value={form.description}
          onChange={handleChange}
          className="textarea"
        ></textarea>

        <label htmlFor="location">위치</label>
        <select
          id="location"
          name="location"
          value={form.location}
          onChange={handleChange}
          className="dropdown"
        >
          <option value="">선택</option>
          {LOCATIONS.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

        <InputText
          name="wage"
          placeholder="시급"
          value={form.wage}
          onChange={handleChange}
        />

        <div className="work-days">
          <h3 className="section-title">근무 요일</h3>
          {DAYS.map((day) => (
            <label key={day} className="checkbox-label">
              <input
                type="checkbox"
                value={day}
                checked={form.workDays.includes(day)}
                onChange={handleCheckboxChange}
              />
              {day}
            </label>
          ))}
        </div>

        <div className="work-time">
          <h3 className="section-title">근무 시간</h3>
          <InputText
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
          />
          ~
          <InputText
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
          />
        </div>

        <div className="image-upload">
          <h3 className="section-title">이미지 업로드</h3>
          <input type="file" name="image" onChange={handleImageChange} />
        </div>

        <Button type="submit" title="작성 완료" variant="primary" />
      </form>
    </div>
  );
};

export default AlbaCreate;
