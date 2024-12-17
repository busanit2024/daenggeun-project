import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import InputText from "../../ui/InputText";
import RoundFilter from "../../ui/RoundFilter";
import { singleFileUpload } from "../../../firebase";
import Radio from "../../ui/Radio";
import "../../../styles/AlbaStyled.css";
import styled from "styled-components";
import axios from "axios";
import useGeolocation from "../../../utils/useGeolocation";
import { useJsApiLoader } from "@react-google-maps/api";
import LocationSearchModal from "../../ui/LocationSearchModal";
import Breadcrumb from "../../ui/Breadcrumb";
import { useArea } from "../../../context/AreaContext";

export const DongneSelectContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;
export const DongneSelect = styled.select`
padding: 12px;
border: 2px solid #cccccc;
border-radius: 8px;
font-size: 18px;
font-family: inherit;
flex-grow: 1;
`;

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  width: 100%;
  
  .checkbox-wrap {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  h2 {
    margin-top: 24px;
  }
`;

const id = sessionStorage.getItem('uid');

const routes = [
  { path: "/", name: "홈" },
  { path: "/alba", name: "알바 검색" },
  { path: "/alba/create", name: "알바 게시물 작성" },
  { path: `/alba/${id}`, name: "알바 상세 보기" },
  { path: `/alba/${id}/edit`, name: "알바 게시물 수정" },
];


const libraries = ['places'];


const AlbaCreate = () => {
  const [form, setForm] = useState({
    title: "",
    userId: id,
    description: "",
    location: { sido: "부산광역시", sigungu: "", emd: "" }, // 로그인 구현될 때까지 임시 위치
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
  const [categoryData, setCategoryData] = useState([]);
  const [wageTypeData, setWageTypeData] = useState([]); // 급여 유형 데이터 추가
  const [workPeriodData, setWorkPeriodData] = useState([]); // 일하는 기간 데이터 추가
  const [busanJuso, setBusanJuso] = useState(null);
  const [locationData, setLocationData] = useState({ sigungu: [], emd: [] });
  const { area } = useArea();
  const [searchFilter, setSearchFilter] = useState({ 
    sido: "부산광역시", sigungu: "", emd: "", 
    category: "all", sort: "" });
  
  const navigate = useNavigate();


  const { isLoaded: isJsApiLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
    language: 'ko',
    region: 'KR',
  });



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

  useEffect(() => {
    // axios.get(`/api/data/filter?name=groupCategory`).then((response) => {
    //   setCategoryData(response.data.filters);
    // }).catch((error) => {
    //   console.error("카테고리를 불러오는데 실패했습니다." + error);
    // });

    // axios.get(`/api/data/filter?name=groupRange`).then((response) => {
    //   setRangeData(response.data.filters);
    // }).catch((error) => {
    //   console.error("동네 범위를 불러오는데 실패했습니다." + error);
    // });

    axios.get(`/api/data/filter?name=busanJuso`).then((response) => {
      const juso = response.data.locationFilters;
      setBusanJuso(juso);
      const guList = juso?.map((item) => item.sigungu);

      setLocationData((prevLocationData) => ({
        ...prevLocationData,
        sigungu: guList,
      }));

    }).catch((error) => {
      console.error("동네 리스트를 불러오는데 실패했습니다." + error);
    });
  }, []);
  // // 지역 데이터 가져오기
  // useEffect(() => {
  //   const fetchBusanJuso = async () => {
  //     try {
  //       const response = await axios.get("/api/data/filter?name=busanJuso");
  //       console.log(response.data)
  //       setBusanJuso(response.data.locationFilters || []);
  //     } catch (error) {
  //       console.error("Failed to fetch busanJuso data:", error);
  //     }
  //   };

  //   fetchBusanJuso();
  // }, []);

  
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


  const getEmdList = (sigungu) => {
    console.log(typeof sigungu)
    console.log("busanJuso", busanJuso)
    if (busanJuso) {
      const emdList = busanJuso.find((item) => item.sigungu == sigungu)?.emd;
      //const emdList = busanJuso.find(sigungu).emd;
      
      console.log("emdList",emdList)
      const emdNameList = emdList?.map((item) => item.emd);
      console.log("emdNameList",emdNameList)
      setLocationData({ ...locationData, emd: emdNameList });
      if (currentLocation.emd !== "") {
        setForm({ ...form, location: { ...form.location, emd: currentLocation.emd } });
      } else {
        setForm({ ...form, location: { ...form.location, emd: emdNameList?.[0] } });
      }
    }
  };


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
    image: imageInfo ?? { url: '../../../images/default/default-image.png' }, // 기본 이미지 설정
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


const currentLocation = useGeolocation(isJsApiLoaded);

useEffect(() => {
  getEmdList(form.location.sigungu);
}, [form.location.sigungu]);


useEffect(() => {
  if (busanJuso) {
    if (currentLocation.sigungu) {
      setForm({ ...form, location: { ...form.location, sigungu: currentLocation.sigungu } });
    } else {
      setForm({ ...form, location: { ...form.location, sigungu: locationData.sigungu?.[0] } });
    }
  }
}, [currentLocation, busanJuso]);

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
      <Breadcrumb routes={routes} />
      <br/>
    <h2>알바 글 등록</h2>
    <br/>
      <form className="form" onSubmit={handleSubmit}>
        <InputText
          name="title"
          placeholder="제목"
          value={form.title}
          onChange={handleChange}
        />
      <Item>
        <h3>지역</h3>
        
        <DongneSelectContainer>
          <div style={{ fontSize: '20px', color: '#666666' }}>부산광역시</div>
          <DongneSelect value={form.location.sigungu} onChange={(e) => setForm({ ...form, location: { ...form.location, sigungu: e.target.value } })}>
            {
              locationData.sigungu?.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
          </DongneSelect>
          <DongneSelect value={form.location.emd} onChange={(e) => setForm({ ...form, location: { ...form.location, emd: e.target.value } })}>
            {locationData.emd?.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </DongneSelect>
        </DongneSelectContainer>

      </Item>

        {/* <div>지역</div>
        <div>
          <DongneSelectContainer>
            <DongneSelect
              name="sigungu"
              value={form.location.sigungu || ""}
              onChange={handleChange}
            >
              <option value="">시군구 선택</option>
              {regionData.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </DongneSelect>
            <DongneSelect
              name="emd"
              value={form.location.emd || ""}
              onChange={handleChange}
            >
              <option value="">읍면동 선택</option>
              {regionData.map((emd) => (
                <option key={emd} value={emd}>
                  {emd}
                </option>
              ))}
            </DongneSelect>
          </DongneSelectContainer>
        </div> */}

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
          placeholder="2024년 최저 시급 : 10,030 원"
          value={form.wage}
          onChange={handleChange}
        />

        <div className="image-upload">
          <h3 className="section-title">이미지 업로드</h3>
          <input type="file" name="image" onChange={handleImageChange} />
          {form.image && (
            <img
              src={form.image}
              alt="업로드된 이미지"
              onError={(e) => {
                e.target.onerror = null; // 무한 반복 방지
                e.target.src = '../../../images/default/default-image.png'; // 기본 이미지 경로
              }}
              style={{ maxWidth: '100%', maxHeight: '200px' }} // 적절한 스타일 설정
            />
          )}
        </div>

        <textarea
          name="description"
          placeholder="상세 내용을 입력해주세요."
          value={form.description}
          onChange={handleChange}
          className="textarea"
        ></textarea>

        <div className="company-info">
          <h3 className="section-title">업체 정보</h3>
          <div className="company-info-style" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div>
          <h4>업체 주소</h4>
          <InputText
            name="workPlace"
            placeholder="ex) 서울시 강남구 강남1로"
            value={form.workPlace}
            onChange={handleChange}
          />
          <Button type="button"  title="주소 검색" variant="primary" onClick={handleAddressSearch} />
          </div>
          <div>
          <h4>업체명</h4><InputText
            name="companyName"
            placeholder="ex) 댕근마켓"
            value={form.companyName}
            onChange={handleChange}
          /></div>
          <div>
          <h4>연락처</h4>     
          <InputText
            name="contactNumber"
            placeholder="010-xxxx-xxxx"
            value={form.contactNumber}
            onChange={handleChange}
          /></div>
          </div>
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
