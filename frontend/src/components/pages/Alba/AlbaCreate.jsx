import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import InputText from "../../ui/InputText";
import RoundFilter from "../../ui/RoundFilter";
import "../../../styles/AlbaStyled.css";
import styled from "styled-components";
import axios from "axios";
import { singleFileUpload } from "../../../firebase";

const AlbaCreate = () => {
  const [form, setForm] = useState({
    creatorId: "",
    title: "",
    description: "",
    location: {emd: ""} ,
    wage: "",
    workDays: [],
    negotiable: false,    
    category: "",
    wageType: "", // 급여 유형 추가
    workPeriod: "", // 일하는 기간 추가
    companyName: "", // 업체명 추가
    workPlace: "", // 일하는 장소 추가
    contactNumber: "", // 연락처 추가
    doNotContact: false // 연락 받지 않기 체크박스 추가
  });
  const [locationData, setLocationData] = useState({ emd: [] });
  const [regionData, setRegionData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [wageTypeData, setWageTypeData] = useState([]); // 급여 유형 데이터 추가
  const [workPeriodData, setWorkPeriodData] = useState([]); // 일하는 기간 데이터 추가
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

  // 급여 유형 데이터 가져오기
  useEffect(() => {
    const fetchWageTypeData = async () => {
      try {
        const response = await axios.get(`/api/data/filter?name=wageType`);
        setWageTypeData(response.data.filters || []);
      } catch (error) {
        console.error("급여 유형 데이터를 불러오는데 실패했습니다:", error);
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
        console.error("일하는 기간 데이터를 불러오는데 실패했습니다:", error);
      }
    };
    fetchWorkPeriodData();
  }, []);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (name === "sigungu" || name === "emd") {
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
  
// 카테고리 필터 변경 핸들러 (단일 선택으로 수정)
const handleCategoryChange = (category) => {
  setForm((prev) => ({
    ...prev,
    category: prev.category === category ? "" : category,
  }));
};

// 급여 유형 변경 핸들러
const handleWageTypeChange = (wageType) => {
  setForm((prev) => ({
    ...prev,
    wageType,
  }));
};

// 일하는 기간 변경 핸들러
const handleWorkPeriodChange = (workPeriod) => {
  setForm((prev) => ({
    ...prev,
    workPeriod,
  }));
};

// 이미지 변경 핸들러
const handleImageChange = async (e) => {
  let imageInfo = null;
  const image = e.target.files[0];
  if (image) {  // 제대로 이미지 존재 여부 확인
    imageInfo = await singleFileUpload(image);
    console.log("업로드된 이미지 정보:", imageInfo);
  }

  setForm((prevForm) => ({
    ...prevForm,
    image: imageInfo,
  }));
};

  const handleAddressSearch = (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    new window.daum.Postcode({
      oncomplete: function (data) {
        setForm((prevForm) => ({
          ...prevForm,
          workPlace: data.address,
        }));
      },
    }).open();
};
  



  useEffect(() => {
    // Daum Postcode script 추가
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 폼 제출 핸들러

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const payload = {
  //       ...form,
  //       workTime: {
  //           start: form.startTime,
  //           end: form.endTime
  //       },
  //   };
  //   console.log(payload)
  //   try {
  //       await axios.post("/api/alba", payload, {
  //       //await axios.post("/api/alba", payload, {
  //           headers: { "Content-Type": "application/json" },
  //       })
  //       alert("글이 성공적으로 작성되었습니다!");
  //       //navigate("/alba");
  //   } catch (error) {
  //       console.error("글 작성 중 오류 발생:", error);
  //   }
  // };
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const cleanedPayload = Object.fromEntries(
      Object.entries({
        ...form,
        createdAt: new Date().toISOString(), // 현재 시간 추가
        workTime: {
          start: form.startTime,
          end: form.endTime
        },
      }).filter(([_, value]) => value !== undefined && value !== null)
    );
  
    console.log("전송할 데이터:", cleanedPayload);
  
    axios.post("/api/alba", cleanedPayload, {
      headers: { "Content-Type": "application/json" },
    })
    .then(() => {
      alert("글이 성공적으로 작성되었습니다!");
      navigate("/alba");
    })
    .catch((error) => {
      console.error("글 작성 중 오류 발생:", error);
    });
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

        <div className="work-days">
          <h3 className="section-title">요일 선택</h3>
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

        <div className="work-time">
          <h3 className="section-title">일하는 시간</h3>
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

        <textarea
          name="description"
          placeholder="상세 내용"
          value={form.description}
          onChange={handleChange}
          className="textarea"
        ></textarea>

        <div className="company-info">
          <h3 className="section-title">업체 정보</h3>
          <InputText
            name="companyName"
            placeholder="업체명"
            value={form.companyName}
            onChange={handleChange}
          />
          
          <Button type="button" title="주소 검색" onClick={handleAddressSearch} />
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
          <p><label>
            <input
              type="checkbox"
              name="doNotContact"
              checked={form.doNotContact}
              onChange={handleChange}
            />
            연락 받지 않기
          </label></p>
        </div>

        <Button type="submit" title="작성 완료" variant="primary" />
      </form>
    </div>
  );
};

export default AlbaCreate;
