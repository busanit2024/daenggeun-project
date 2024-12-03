import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../../ui/Button";
import RoundFilter from "../../ui/RoundFilter";
import { singleFileUpload } from "../../../firebase";
import Radio from "../../ui/Radio";
import Switch from "../../ui/Switch";


const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  width: 640px;
  margin: 24px auto;
`;

const Item = styled.div`
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

const InputContainer = styled.div`
  display: flex;
  width: ${props => props.full ? "100%" : "64px"};
  padding: ${props => props.full ? "16px" : "8px"};
  border: 2px solid #cccccc;
  border-radius: 8px;
  min-height: ${props => props.height ?? "auto"};
`;

const Input = styled.input`
  width: 100%;
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 18px;
  font-family: inherit;
`;

const Textarea = styled.textarea`
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 18px;
  font-family: inherit;
  resize: none;
`;

const TextLength = styled.div`
  display: flex;
  justify-content: flex-end;
  justify-self: end;
  margin-left: auto;
`;

const RadioContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

const SelectBoxContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr;
  gap: 16px;
`;

const SelectBox = styled.label`
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

const FileInputContainer = styled.div` 
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

const ageData = [
  "누구나", "20대", "30대", "40대", "50대", "60대", "직접 입력",
]

const maxMemberData = [
  0, 10, 20, 30, 50, 100, -1,
]

const titleInputConstraint = { minLength: 3, maxLength: 24 };
const descriptionInputConstraint = { minLength: 8, maxLength: 500 };

export default function GroupCreatePage(props) {
  const navigate = useNavigate();

  const [categoryData, setCategoryData] = useState([]);
  const [rangeData, setRangeData] = useState([]);

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [range, setRange] = useState("0");
  const [requireApproval, setRequireApproval] = useState(false);
  const [age, setAge] = useState(ageData[0]);
  const [ageInput, setAgeInput] = useState(false);
  const [ageInputValue, setAgeInputValue] = useState({ min: 0, max: 0 });
  const [maxMember, setMaxMember] = useState(0);
  const [maxMemberInput, setMaxMemberInput] = useState(false);
  const [requireIdCheck, setRequireIdCheck] = useState(false);
  const [useNickname, setUseNickname] = useState(false);
  const [image, setImage] = useState(null);


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
  }, []);

  useEffect(() => {
    setAge(`${ageInputValue.min}세~${ageInputValue.max}세`);
  }, [ageInputValue]);

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

      const response = await axios.post("/api/group/save", {
        title: title,
        description: description,
        groupRange: range,
        category: category,
        requireIdCheck: requireIdCheck,
        requireApproval: requireApproval,
        ageRange: age,
        maxMember: maxMember,
        useNickname: useNickname,
        image: imageInfo,
        boards: ["자유 게시판"],
      });
      alert("모임이 생성되었습니다.");
      navigate("/group");

    } catch (error) {
      alert("모임 생성에 실패했습니다.");
      console.error(error);
    };
  }



  const firstStep = (
    <Container>
      <Item>
        <h2>어떤 모임을 만들까요?</h2>
        <h4>모임명</h4>
        <InputContainer full>
          <Input type="text" placeholder="모임명이 짧을수록 이해하기 쉬워요." value={title} onChange={(e) => setTitle(e.target.value)} />
        </InputContainer>
        <TextLength>{`${title.length}/${titleInputConstraint.maxLength}`}</TextLength>
      </Item>


      <Item>
        <h4>카테고리</h4>
        <RadioContainer>
          {categoryData.map((item) => (<>
            <RoundFilter key={item.name} title={item.name} variant={category === item.name ? 'selected' : 'category'} value={item.name} onClick={() => {setCategory(item.name)}} />
          </>
          ))}
        </RadioContainer>
      </Item>


      <Item>
        <h4>모임 소개</h4>
        <InputContainer full height="200px">
          <Textarea placeholder="활동 중심으로 모임을 소개해주세요. 모임 설정에서 언제든지 바꿀 수 있어요." onChange={(e) => setDescription(e.target.value)}></Textarea>
        </InputContainer>
        <TextLength>{`${description.length}/${descriptionInputConstraint.maxLength}`}</TextLength>
      </Item>


      <ButtonContainer>
        <Button title="다음" variant="primary" grow onClick={() => setStep(2)}></Button>
      </ButtonContainer>

    </Container>
  );

  const secondStep = (
    <Container>
      <Item>
        <h2>이웃들을 모집할 동네를 설정해주세요</h2>
        <SelectBoxContainer>
          {rangeData.map((item) => (
            <SelectBox key={item.value} selected={item.value === range}>
              {item.name}
              <Radio big checked={range === item.value} name="range" value={item.value} onChange={(e) => setRange(e.target.value)} />
            </SelectBox>
          ))}
        </SelectBoxContainer>
      </Item>

      <Item>
        <h2>가입은 어떻게 받을까요?</h2>
        <SelectBoxContainer>
          <SelectBox selected={requireApproval === false}>
            바로 가입
            <Radio big checked={requireApproval === false} name="requireApproval" value={false} onChange={(e) => setRequireApproval(e.target.value === 'true')} />
          </SelectBox>
          <SelectBox selected={requireApproval === true}>
            승인 후 가입
            <Radio big checked={requireApproval === true} name="requireApproval" value={true} onChange={(e) => setRequireApproval(e.target.value === 'true')} />
          </SelectBox>
        </SelectBoxContainer>
      </Item>

      <h2>어떤 이웃과 함께하고 싶나요?</h2>
      <Item>
        <p>연령대</p>
        <RadioContainer>
          {ageData.map((item) => (
              <RoundFilter title={item} variant={((ageInput && item === '직접 입력') ||  (item === age)) ? 'selected' : 'category' } value={item} onClick={() => {
                if (item === '직접 입력') {
                  setAgeInput(true);
                  setAge('직접 입력');
                } else {
                  setAgeInput(false);
                  setAge(item);
              }}} />
          ))}
          {ageInput && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <InputContainer>
                <Input type="number" onChange={(e) => setAgeInputValue({ ...ageInputValue, min: e.target.value })} />
                <span>세</span>
              </InputContainer>
              <span> ~ </span>
              <InputContainer>
                <Input type="number" onChange={(e) => setAgeInputValue({ ...ageInputValue, max: e.target.value })} />
                <span> 세</span>
              </InputContainer>

            </div>
          )}
        </RadioContainer>

      </Item>

      <Item>
        <p>최대 인원</p>
        <RadioContainer>
          {maxMemberData.map((item) => (
            <>
            <RoundFilter title={item === 0 ? "제한없음" : item === -1 ? "직접 입력" : item} variant={item === maxMember ? 'selected' : 'category'} value={item} onClick={() => { 
              if (item === -1) {
                setMaxMemberInput(true);
                setMaxMember(-1);
              } else {
                setMaxMemberInput(false);
                setMaxMember(item);
              } 
            }} />
            </>
          ))}
          {maxMemberInput && (
            <div>
              <InputContainer>
                <Input type="number" onChange={(e) => setMaxMember(e.target.value)} />
                <span>명</span>
              </InputContainer>

            </div>
          )}
        </RadioContainer>


      </Item>

      <Item>
        <h2>본인인증이 필요한 모임인가요?</h2>
        <p>본인인증을 완료한 이웃만 모임에 가입할 수 있어요.</p>
        <label className="checkbox-wrap">
          본인인증 사용
          <Switch value={requireIdCheck} checked={requireIdCheck} onChange={(e) => setRequireIdCheck(e.target.checked)} />
        </label>
      </Item>

      <Item>
        <h2>별명을 사용할까요?</h2>
        <p>별명은 이 모임에서만 닉네임 옆에 함께 표시돼요.</p>
        <label className="checkbox-wrap">
          별명 사용
          <Switch value={useNickname} checked={useNickname} onChange={(e) => setUseNickname(e.target.checked)} />
        </label>
      </Item>


      <ButtonContainer>
        <Button title="이전" variant="gray" onClick={() => setStep(1)} />
        <Button title="다음" variant="primary" grow onClick={() => setStep(3)} />
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

  return (
    <div>
      <h1>모임 만들기</h1>
      {step === 1 && firstStep}
      {step === 2 && secondStep}
      {step === 3 && thirdStep}
    </div>
  );
} 