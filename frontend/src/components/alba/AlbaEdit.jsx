import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../ui/Button";
import InputText from "../ui/InputText";
import RoundFilter from "../ui/RoundFilter";
import "../../styles/AlbaStyled.css";
import styled from "styled-components";
import axios from "axios";
import { singleFileUpload } from "../../firebase";

const AlbaEdit = () => {
  const { id } = useParams(); // URL과에서 ID 추작
  const navigate = useNavigate(); // 페이지 이동 hook
  const [form, setForm] = useState({
    title: "",
    description: "",
    wage: "",
    workDays: [],
    startTime: "",
    endTime: "",
    image: "",
    category: "", // 카테고리를 단일 선택으로 처리
    wageType: "", // 급여 유형 추가
    workPeriod: "", // 일하는 기간 추가
    companyName: "", // 업체명 추가
    workPlace: "", // 일하는 장소 추가
    contactNumber: "", // 연락처 추가
    doNotContact: false // 연락 받지 않기 체크박스 추가
  });

  const [categoryData, setCategoryData] = useState([]);
  const [wageTypeData, setWageTypeData] = useState([]); // 급여 유형 데이터 추가
  const [workPeriodData, setWorkPeriodData] = useState([]); // 일하는 기간 데이터 추가

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

  // 기존 데이터 불러오기
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`/api/alba/${id}`); // GET 요청으로 기존 데이터 조회
        setForm(response.data || {}); // 응답 데이터를 상태에 설정, null 방지
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };
    fetchJob();
  }, [id]);

  // 카테고리 데이터 가져오기
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(`/api/data/filter?name=albaCategory`);
        setCategoryData(response.data.filters || []);
      } catch (error) {
        console.error("카테고리 필터 데이터를 불러온다는 실패했습니다:", error);
      }
    };
    fetchCategoryData();
  }, []);

  // 급여 유형 데이터 가져오기
  useEffect(() => {
    const fetchWageTypeData = async () => {
      try {
        const response = await axios.get(`/api/data/filter?name=wageType`);
        setWageTypeData(response.data.filters || []);
      } catch (error) {
        console.error("급여 유형 데이터를 불러온다는 실패했습니다:", error);
      }
    };
    fetchWageTypeData();
  }, []);

  // 일하는 기간 데이터 가져오기
  useEffect(() => {
    const fetchWorkPeriodData = async () => {
      try {
        const response = await axios.get(`/api/data/filter?name=workType`);
        setWorkPeriodData(response.data.filters || []);
      } catch (error) {
        console.error("일하는 기간 데이터를 불러온다는 실패했습니다:", error);
      }
    };
    fetchWorkPeriodData();
  }, []);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // 근무 요일 라운드 필터 변경 핸들러
  const handleWorkDayChange = (day) => {
    setForm((prev) => ({
      ...prev,
      workDays: prev.workDays?.includes(day)
        ? prev.workDays.filter((d) => d !== day)
        : [...(prev.workDays || []), day],
    }));
  };

  // 카테고리 필터 변경 핸들러 (단일 선택으로 수정)
  const handleCategoryChange = (category) => {
    setForm((prev) => ({
      ...prev,
      category: prev.category === category ? "" : category, // 동일하면 해제, 아니면 선택
    }));
  };

  // 급여 유형 변경 핸들러
  const handleWageTypeChange = (wageType) => {
    setForm((prev) => ({
      ...prev,
      wageType: wageType,
    }));
  };

  // 일하는 기간 변경 핸들러
  const handleWorkPeriodChange = (workPeriod) => {
    setForm((prev) => ({
      ...prev,
      workPeriod: workPeriod,
    }));
  };

  // 이미지 변경 핸들러
  const handleImageChange = async (e) => {
    let imageInfo = null;
    const image = e.target.files[0];
    if (image) {
      imageInfo = await singleFileUpload(image);
      console.log(imageInfo);
    }

    setForm((prevForm) => ({
      ...prevForm,
      image: imageInfo,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      workTime: {
        start: form.startTime,
        end: form.endTime,
      },
    };

    // Remove any properties that shouldn't be part of the payload (like undefined or unnecessary values)
    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null)
    );
    try {
      await axios.put(`/api/alba/${id}`, cleanedPayload, {
        headers: { "Content-Type": "application/json" },
      });
      alert("수정이 완료되었습니다.");
      navigate(`/alba/${id}`); // 상세 페이지로 이동
    } catch (error) {
      if (error.response && error.response.status === 405) {
        console.error("지원되지 않는 메서드입니다. PUT 메서드가 허용되지 않는 경우입니다:", error);
        alert("지원되지 않는 메서드입니다. 관리자에게 문의하세요.");
      } else {
        console.error("수정 중 오류 발생:", error);
        alert("수정 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="container">
      <h1 className="title">알바 수정</h1>
      <form className="form" onSubmit={handleSubmit}>
        <InputText
          name="title"
          placeholder="제목"
          value={form.title}
          onChange={handleChange}
        />

        <div className="category-selection">
          <h3 className="section-title">하는 일</h3>
          <HorizontalContainer>
            {categoryData.map((item) => (
              <StyledRoundFilter
                key={item.name}
                title={item.name}
                variant={form.category === item.name ? "selected" : "category"}
                onClick={() => handleCategoryChange(item.name)}
              />
            ))}
          </HorizontalContainer>
        </div>

        <textarea
          name="description"
          placeholder="상세 내용"
          value={form.description}
          onChange={handleChange}
          className="textarea"
        ></textarea>

        <div className="work-period">
          <h3 className="section-title">일하는 기간</h3>
          <HorizontalContainer>
            {workPeriodData.map((item) => (
              <StyledRoundFilter
                key={item.name}
                title={item.name}
                variant={form.workPeriod === item.name ? "selected" : "category"}
                onClick={() => handleWorkPeriodChange(item.name)}
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
          <label>
            <input
              type="checkbox"
              name="negotiable"
              checked={form.negotiable}
              onChange={handleChange}
            />
            협의 가능
          </label>
        </div>

        <div className="wage-type">
          <h3 className="section-title">급여</h3>
          <HorizontalContainer>
            {wageTypeData.map((item) => (
              <StyledRoundFilter
                key={item.name}
                title={item.name}
                variant={form.wageType === item.name ? "selected" : "category"}
                onClick={() => handleWageTypeChange(item.name)}
              />
            ))}
          </HorizontalContainer>
        </div>
        <InputText
          name="wage"
          placeholder="10,030 원"
          value={form.wage}
          onChange={handleChange}
        />

        <div className="image-upload">
          <h3 className="section-title">이미지 업로드</h3>
          <input type="file" name="image" onChange={handleImageChange} />
        </div>

        <div className="company-info">
          <h3 className="section-title">업체 정보</h3>
          <InputText
            name="companyName"
            placeholder="업체명"
            value={form.companyName}
            onChange={handleChange}
          />
          <InputText
            name="workPlace"
            placeholder="일하는 장소"
            value={form.workPlace}
            onChange={handleChange}
          />
          <InputText
            name="contactNumber"
            placeholder="연락처"
            value={form.contactNumber}
            onChange={handleChange}
          />
          <label>
            <input
              type="checkbox"
              name="doNotContact"
              checked={form.doNotContact}
              onChange={handleChange}
            />
            연락 받지 않기

          </label>
        </div>

        <Button type="submit" title="수정 완료" variant="primary" />
      </form>
    </div>
  );
};

export default AlbaEdit;