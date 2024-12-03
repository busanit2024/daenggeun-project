import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import InputText from "../ui/InputText";
import RoundFilter from "../ui/RoundFilter";
import "../../styles/AlbaStyled.css";
import styled from "styled-components";
import axios from "axios";

const AlbaCreate = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: { sigungu: "", emd: "" },
    wage: "",
    workDays: [],
    startTime: "",
    endTime: "",
    image: null,
    category: []
  });

  const [regionData, setRegionData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const navigate = useNavigate();

  const StyledRoundFilter = styled(RoundFilter)`
    padding: 4px 8px;
    margin: 4px;
    font-size: 0.9rem;
    display: inline-block;
    cursor: pointer;
    white-space: nowrap;
  `;

  const HorizontalContainer = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  `;

  // 지역 데이터 가져오기
  useEffect(() => {
    const fetchRegionData = async () => {
      try {
        const response = await axios.get(`/api/data/filter?name=busanJuso`);
        setRegionData(response.data.locationFilters || []);
      } catch (error) {
        console.error("지역 필터 데이터를 불러오는데 실패했습니다:", error);
      }
    };
    fetchRegionData();
  }, []);

  // 카테고리 데이터 가져오기
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(`/api/data/filter?name=albaCategory`);
        setCategoryData(response.data.filters || []);
      } catch (error) {
        console.error("카테고리 필터 데이터를 불러오는데 실패했습니다:", error);
      }
    };
    fetchCategoryData();
  }, []);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "sigungu" || name === "emd") {
      setForm((prevForm) => ({
        ...prevForm,
        location: { ...prevForm.location, [name]: value },
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // 근무 요일 라운드 필터 변경 핸들러
  const handleWorkDayChange = (day) => {
    setForm((prev) => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter((d) => d !== day)
        : [...prev.workDays, day],
    }));
  };

  // 카테고리 필터 변경 핸들러
  const handleCategoryChange = (category) => {
    setForm((prev) => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter((c) => c !== category)
        : [...prev.category, category],
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
      if (key === "workDays" || key === "category") {
        form[key].forEach((item) => formData.append(`${key}[]`, item));
      } else if (key === "location") {
        formData.append("sigungu", form.location.sigungu);
        formData.append("emd", form.location.emd);
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

        <div className="location-selection">
          <div className="dropdown-container">
            <label htmlFor="sigungu">구 선택</label>
            <select
              id="sigungu"
              name="sigungu"
              value={form.location.sigungu}
              onChange={handleChange}
              className="dropdown"
            >
              <option value="">구 선택</option>
              {regionData.map((region) => (
                <option key={region.sigungu} value={region.sigungu}>
                  {region.sigungu}
                </option>
              ))}
            </select>
          </div>
          <div className="dropdown-container">
            <label htmlFor="emd">동 선택</label>
            <select
              id="emd"
              name="emd"
              value={form.location.emd}
              onChange={handleChange}
              className="dropdown"
              disabled={!form.location.sigungu}
            >
              <option value="">동 선택</option>
              {regionData
                .find((region) => region.sigungu === form.location.sigungu)
                ?.emd?.map((dong) => (
                  <option key={dong.emd} value={dong.emd}>
                    {dong.emd}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <InputText
          name="wage"
          placeholder="시급"
          value={form.wage}
          onChange={handleChange}
        />

        <div className="work-days">
          <h3 className="section-title">근무 요일</h3>
          <HorizontalContainer>
            {"월화수목금토일".split("").map((day) => (
              <StyledRoundFilter
                key={day}
                title={day}
                variant={form.workDays.includes(day) ? "selected" : "category"}
                onClick={() => handleWorkDayChange(day)}
              />
            ))}
          </HorizontalContainer>
        </div>

        <div className="category-selection">
          <h3 className="section-title">하는 일</h3>
          <HorizontalContainer>
            {categoryData.map((item) => (
              <StyledRoundFilter
                key={item.name}
                title={item.name}
                variant={form.category.includes(item.name) ? "selected" : "category"}
                onClick={() => handleCategoryChange(item.name)}
              />
            ))}
          </HorizontalContainer>
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
