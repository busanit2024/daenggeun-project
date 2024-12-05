import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../../ui/Button";
import RoundFilter from "../../ui/RoundFilter";
import { singleFileUpload } from "../../../firebase";
import Radio from "../../ui/Radio";
import Switch from "../../ui/Switch";
import Breadcrumb from "../../Breadcrumb";
import { useJsApiLoader } from "@react-google-maps/api";
import useGeolocation from "../../../utils/useGeolocation";
import InputText from "../../ui/InputText";


export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 24px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  width: 640px;
  margin: 24px auto;
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
`;

export const InputContainer = styled.div`
  display: flex;
  width: ${props => props.full ? "100%" : "96px"};
  padding: ${props => props.full ? "16px" : "8px"};
  border: 2px solid #cccccc;
  border-radius: 8px;
  min-height: ${props => props.height ?? "auto"};
`;

export const Input = styled.input`
  width: 100%;
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 18px;
  font-family: inherit;
`;

export const Textarea = styled.textarea`
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 18px;
  font-family: inherit;
  resize: none;
`;

export const TextLength = styled.div`
  display: flex;
  justify-content: flex-end;
  justify-self: end;
  margin-left: auto;
`;

const DongneSelectContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const DongneSelect = styled.select`
  padding: 12px;
  border: 2px solid #cccccc;
  border-radius: 8px;
  font-size: 18px;
  font-family: inherit;
  flex-grow: 1;
`;

export const RadioContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

export const SelectBoxContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr;
  gap: 16px;
`;

export const SelectBox = styled.label`
  padding: 24px;
  border-width: 1px;
  border-style: solid;
  border-color: ${props => props.selected ? "#999999" : "#cccccc"};
  border-radius: 8px;
  background-color: ${props => props.selected ? "#ebebeb" : "white"};
  display: flex;
  gap: 8px;
  justify-content: space-between;
  align-items: center;
`;

export const FileInputContainer = styled.div` 
  display: flex;
  justify-content: start;
  gap: 16px;
`;

const CustomFileInput = styled.div`
  display: flex;
  width: 160px;
  height: 160px;
  border: 1px solid #cccccc;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .camera-icon {
    width: 50%;
    height: 50%;
  }
`;

const ImagePreview = styled.div`
  width: 160px;
  height: 160px;
  border: 1px solid #cccccc;
  border-radius: 8px;
  position: relative;
  
  .preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }

  .delete-button {
    position: absolute;
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    top: -8px;
    right: -8px;
    background-color: black;
    border: none;
    cursor: pointer;
    border-radius: 50%;
  }
`;

export const InputCheckMessage = styled.span`
  color: red;
  font-size: 14px;
`;


const ageData = [
  "누구나", "20대", "30대", "40대", "50대", "60대", "직접 입력",
]

const maxMemberData = [
  0, 10, 20, 30, 50, 100, -1,
]

const titleInputConstraint = { minLength: 3, maxLength: 24 };
const descriptionInputConstraint = { minLength: 8, maxLength: 500 };

const libraries = ['places'];

export default function GroupCreatePage(props) {
  const navigate = useNavigate();

  const [categoryData, setCategoryData] = useState([]);
  const [rangeData, setRangeData] = useState([]);
  const [busanJuso, setBusanJuso] = useState(null);
  const [locationData, setLocationData] = useState({ sigungu: [], emd: [] });
  const [nickname, setNickName] = useState("");

  const [step, setStep] = useState(1);
  const [input, setInput] = useState({
    title: "",
    description: "",
    category: "",
    groupRange: "0",
    ageRange: "누구나",
    maxMember: 0,
    requireApproval: false,
    requireIdCheck: false,
    useNickname: false,
    location: { sido: "부산광역시", sigungu: "", emd: "" } // 로그인 구현될 때까지 임시 위치
  });

  const [ageInput, setAgeInput] = useState(false);
  const [ageInputValue, setAgeInputValue] = useState({ min: 0, max: 0 });
  const [maxMemberInput, setMaxMemberInput] = useState(false);
  const [image, setImage] = useState(null);
  const [inputCheck, setInputCheck] = useState({ title: false, description: false, category: false, maxMember: false, age: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoaded: isJsApiLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
    language: 'ko',
    region: 'KR',
  });

  const currentLocation = useGeolocation(isJsApiLoaded);

  useEffect(() => {
    axios.get(`/api/data/filter?name=groupCategory`).then((response) => {
      setCategoryData(response.data.filters);
    }).catch((error) => {
      console.error("카테고리를 불러오는데 실패했습니다." + error);
    });

    axios.get(`/api/data/filter?name=groupRange`).then((response) => {
      setRangeData(response.data.filters);
    }).catch((error) => {
      console.error("동네 범위를 불러오는데 실패했습니다." + error);
    });

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

  useEffect(() => {
    if (isSubmitting) {
      const check = validateInput();
      setInputCheck(check);
    }
  }, [input, isSubmitting]);

  useEffect(() => {
    if (ageInput) {
      setInput({ ...input, ageRange: `${ageInputValue.min}세~${ageInputValue.max}세` });
    }
  }, [ageInputValue, ageInput]);

  useEffect(() => {
    getEmdList(input.location.sigungu);
  }, [input.location.sigungu]);

  useEffect(() => {
    if (busanJuso) {
      if (currentLocation.sigungu) {
        setInput({ ...input, location: { ...input.location, sigungu: currentLocation.sigungu } });
      } else {
        setInput({ ...input, location: { ...input.location, sigungu: locationData.sigungu?.[0] } });
      }
    }
  }, [currentLocation, busanJuso]);


  const getEmdList = (sigungu) => {
    if (busanJuso) {
      const emdList = busanJuso.find((item) => item.sigungu === sigungu)?.emd;
      const emdNameList = emdList?.map((item) => item.emd);
      setLocationData({ ...locationData, emd: emdNameList });
      if (currentLocation.emd !== "") {
        setInput({ ...input, location: { ...input.location, emd: currentLocation.emd } });
      } else {
        setInput({ ...input, location: { ...input.location, emd: emdNameList?.[0] } });
      }
    }
  };


  const validateInput = () => {
    const newCheck = { title: false, description: false, category: false, maxMember: false, age: false };
    if (input.title.length < titleInputConstraint.minLength) {
      newCheck.title = true;
    }
    if (input.description.length < descriptionInputConstraint.minLength) {
      newCheck.description = true;
    }
    if (input.category === "") {
      newCheck.category = true;
    }

    if (maxMemberInput) {
      if (input.maxMember < 1) {
        newCheck.maxMember = true;
      }
    }

    if (ageInput) {
      if (ageInputValue.min < 1 || ageInputValue.max < 1 || ageInputValue.min > ageInputValue.max) {
        newCheck.age = true;
      }
    }

    return newCheck;
  }



  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  }

  const handleCustomFileInputClick = () => {
    document.querySelector('input[type="file"]').click();
  }

  const createGroup = async () => {
    let imageInfo = null;
    try {
      if (image !== null) {
        imageInfo = await singleFileUpload(image);
        console.log(imageInfo);
      }

      const userId = sessionStorage.getItem('uid');

      const memberProfile = {
        userId: userId,
        position: 'ADMIN',
        registeredDate : new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' }).replace(' ', 'T'),
        groupNickName: nickname,
      }

      const response = await axios.post("/api/group/save", {
        ...input,
        image: imageInfo,
        boards: ["자유 게시판"],
        userId: userId,
        members: [memberProfile],
      });
      alert("모임이 생성되었습니다.");
      navigate("/group");

    } catch (error) {
      alert("모임 생성에 실패했습니다.");
      console.error(error);
    };
  }

  const setNextStep = (nextStep) => {
    setIsSubmitting(true);
    const check = validateInput();
    setInputCheck(check);
    const errorCount = Object.values(check).filter(value => value === true).length;
    if (errorCount > 0) {
      return;
    }
    setIsSubmitting(false);
    setStep(nextStep);
  }



  const firstStep = (
    <Container>
      <Item>
        <h2>어떤 모임을 만들까요?</h2>
        <h4>모임명</h4>
        <InputContainer full>
          <Input type="text" placeholder="모임명이 짧을수록 이해하기 쉬워요." value={input.title} onChange={(e) => setInput({ ...input, title: e.target.value })} />
        </InputContainer>
        <div style={{ display: 'flex' }}>
          <InputCheckMessage>{inputCheck.title && "모임명을 3자 이상 입력해주세요."}</InputCheckMessage>
          <TextLength>{`${input.title.length}/${titleInputConstraint.maxLength}`}</TextLength>
        </div>

      </Item>

      <Item>
        <h4>동네</h4>
        <DongneSelectContainer>
          <div style={{ fontSize: '20px', color: '#666666' }}>부산광역시</div>
          <DongneSelect value={input.location.sigungu} onChange={(e) => setInput({ ...input, location: { ...input.location, sigungu: e.target.value } })}>
            {
              locationData.sigungu?.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
          </DongneSelect>
          <DongneSelect value={input.location.emd} onChange={(e) => setInput({ ...input, location: { ...input.location, emd: e.target.value } })}>
            {locationData.emd?.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </DongneSelect>
        </DongneSelectContainer>

      </Item>


      <Item>
        <h4>카테고리</h4>
        <RadioContainer>
          {categoryData.map((item) => (<>
            <RoundFilter key={item.name} title={item.name} variant={input.category === item.name ? 'selected' : 'category'} value={item.name} onClick={() => { setInput({ ...input, category: item.name }) }} />
          </>
          ))}
        </RadioContainer>
        <InputCheckMessage>{inputCheck.category && "카테고리를 선택해주세요."}</InputCheckMessage>
      </Item>


      <Item>
        <h4>모임 소개</h4>
        <InputContainer full height="200px">
          <Textarea placeholder="활동 중심으로 모임을 소개해주세요. 모임 설정에서 언제든지 바꿀 수 있어요." onChange={(e) => setInput({ ...input, description: e.target.value })} />
        </InputContainer>
        <div style={{ display: 'flex' }}>
          <InputCheckMessage>{inputCheck.description && "모임 소개를 8자 이상 입력해주세요."}</InputCheckMessage>
          <TextLength>{`${input.description.length}/${descriptionInputConstraint.maxLength}`}</TextLength>
        </div>

      </Item>


      <ButtonContainer>
        <Button title="다음" variant="primary" grow onClick={() => setNextStep(2)}></Button>
      </ButtonContainer>

    </Container>
  );

  const secondStep = (
    <Container>
      <Item>
        <h2>이웃들을 모집할 동네를 설정해주세요</h2>
        <SelectBoxContainer>
          {rangeData.map((item) => (
            <SelectBox key={item.value} selected={item.value === input.groupRange}>
              {item.name}
              <Radio big checked={input.groupRange === item.value} name="range" value={item.value} onChange={(e) => setInput({ ...input, groupRange: e.target.value })} />
            </SelectBox>
          ))}
        </SelectBoxContainer>
      </Item>

      <Item>
        <h2>가입은 어떻게 받을까요?</h2>
        <SelectBoxContainer>
          <SelectBox selected={input.requireApproval === false}>
            바로 가입
            <Radio big checked={input.requireApproval === false} name="requireApproval" value={false} onChange={(e) => setInput({ ...input, requireApproval: e.target.value === 'true' })} />
          </SelectBox>
          <SelectBox selected={input.requireApproval === true}>
            승인 후 가입
            <Radio big checked={input.requireApproval === true} name="requireApproval" value={true} onChange={(e) => setInput({ ...input, requireApproval: e.target.value === 'true' })} />
          </SelectBox>
        </SelectBoxContainer>
      </Item>

      <h2>어떤 이웃과 함께하고 싶나요?</h2>
      <Item>
        <p>연령대</p>
        <RadioContainer>
          {ageData.map((item) => (
            <RoundFilter key={item} title={item} variant={((ageInput && item === '직접 입력') || (item === input.ageRange)) ? 'selected' : 'category'} value={item} onClick={() => {
              if (item === '직접 입력') {
                setAgeInput(true);
                setInput({ ...input, ageRange: '직접 입력' });
              } else {
                setAgeInput(false);
                setInput({ ...input, ageRange: item });
              }
            }} />
          ))}
          {ageInput && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <InputContainer>
                <Input type="number" value={ageInputValue.min} onChange={(e) => { (e.target.value >= 0) && setAgeInputValue({ ...ageInputValue, min: e.target.value }) }} />
                <span>세</span>
              </InputContainer>
              <span> ~ </span>
              <InputContainer>
                <Input type="number" value={ageInputValue.max} onChange={(e) => { (e.target.value >= 0) && setAgeInputValue({ ...ageInputValue, max: e.target.value }) }} />
                <span> 세</span>
              </InputContainer>

            </div>
          )}
        </RadioContainer>
        <InputCheckMessage>{inputCheck.age && '연령대를 입력해 주세요.'}</InputCheckMessage>

      </Item>

      <Item>
        <p>최대 인원</p>
        <RadioContainer>
          {maxMemberData.map((item) => (
            <>
              <RoundFilter key={item} title={item === 0 ? "제한없음" : item === -1 ? "직접 입력" : item} variant={(item === input.maxMember || (item === -1 && maxMemberInput)) ? 'selected' : 'category'} value={item} onClick={() => {
                if (item === -1) {
                  setMaxMemberInput(true);
                  setInput({ ...input, maxMember: -1 });
                } else {
                  setMaxMemberInput(false);
                  setInput({ ...input, maxMember: item });
                }
              }} />
            </>
          ))}
          {maxMemberInput && (
            <div>
              <InputContainer>
                <Input type="number" value={input.maxMember === -1 ? 0 : input.maxMember} onChange={(e) => { e.target.value >= 0 && setInput({ ...input, maxMember: e.target.value }) }} />
                <span>명</span>
              </InputContainer>

            </div>
          )}
        </RadioContainer>
        <InputCheckMessage>{inputCheck.maxMember && '최대 인원을 입력해 주세요.'}</InputCheckMessage>
      </Item>

      <Item>
        <h2>본인인증이 필요한 모임인가요?</h2>
        <p>본인인증을 완료한 이웃만 모임에 가입할 수 있어요.</p>
        <label className="checkbox-wrap">
          본인인증 사용
          <Switch value={input.requireIdCheck} checked={input.requireIdCheck} onChange={(e) => setInput({ ...input, requireIdCheck: e.target.checked })} />
        </label>
      </Item>

      <Item>
        <h2>별명을 사용할까요?</h2>
        <p>별명은 이 모임에서만 닉네임 옆에 함께 표시돼요.</p>
        <label className="checkbox-wrap">
          별명 사용
          <Switch value={input.useNickname} checked={input.useNickname} onChange={(e) => setInput({ ...input, useNickname: e.target.checked })} />
        </label>
        {input.useNickname && <InputText type="text" value={nickname} underline placeholder="사용할 별명을 입력해주세요." onChange={(e) => setNickName(e.target.value)} /> }
      </Item>


      <ButtonContainer>
        <Button title="이전" variant="gray" onClick={() => setStep(1)} />
        <Button title="다음" variant="primary" grow onClick={() => setNextStep(3)} />
      </ButtonContainer>

    </Container>
  );

  const thirdStep = (
    <Container>
      <Item>
        <h2>대표사진을 등록해주세요</h2>
        <p>전체 모임 목록에서 보이는 대표 이미지에요.</p>
        <FileInputContainer>
          <input style={{ display: "none" }} type="file" onChange={handleImageChange} />
          <CustomFileInput onClick={handleCustomFileInputClick}>
            <img className="camera-icon" src="/images/icon/camera.svg" alt="대표 이미지 등록" />
          </CustomFileInput>
          {image && <ImagePreview>
            <img className="preview" src={URL.createObjectURL(image)} alt="대표 이미지" />
            <button className="delete-button" onClick={() => setImage(null)}>
              <img src="/images/icon/cancel.svg" alt="삭제" />
            </button>
          </ImagePreview>}
        </FileInputContainer>
      </Item>

      <ButtonContainer>
        <Button title="이전" variant="gray" onClick={() => setStep(2)} />
        <Button title="모임 만들기" variant="primary" grow onClick={createGroup} />
      </ButtonContainer>

    </Container>
  );

  const routes = [
    { path: '/group', name: '모임' },
    { path: `/group/create`, name: '모임 만들기' },
  ];

  return (
    <div>
      <Breadcrumb routes={routes} />
      {/* <h1>모임 만들기</h1> */}
      {step === 1 && firstStep}
      {step === 2 && secondStep}
      {step === 3 && thirdStep}
    </div>
  );
} 