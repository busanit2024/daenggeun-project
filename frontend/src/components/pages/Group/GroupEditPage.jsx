import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../../ui/Button";
import RoundFilter from "../../ui/RoundFilter";
import { deleteFile, singleFileUpload } from "../../../firebase";
import InputText from "../../ui/InputText";
import Switch from "../../ui/Switch";
import Radio from "../../ui/Radio";


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


const ImagePreview = styled.div`
  width: 160px;
  height: 160px;
  border: 1px solid #cccccc;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  
  .preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }

  .camera-icon {
    position: absolute;
    width: 64px;
    height: 64px;
    bottom: -12px;
    right: -12px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-radius: 50%;
    border: 1px solid #cccccc;
  }

  .camera-icon img {
    width: 50%;
    height: 50%;
  }
`;


const InputCheckMessage = styled.span`
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

export default function GroupEditPage(props) {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [group, setGroup] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [rangeData, setRangeData] = useState([]);
  const [boardDivisions, setBoardDivisions] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [ageInput, setAgeInput] = useState(false);
  const [ageInputValue, setAgeInputValue] = useState({ min: 0, max: 0 });
  const [maxMemberInput, setMaxMemberInput] = useState(false);
  const [prevFile, setPrevFile] = useState("");
  const [image, setImage] = useState(null);
  const [inputCheck, setInputCheck] = useState({ title: false, description: false, category: false, maxMember: false, age: false });


  useEffect(() => {
    axios.get(`/api/group/view/${groupId}`).then((response) => {
      setGroup(response.data);
      setPrevFile(response.data.image);
    }).catch((error) => {
      console.error("모임 정보를 불러오는데 실패했습니다." + error);
    });

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
      const check = validateInput();
      setInputCheck(check);
  }, [group]);

  useEffect(() => {
    if (ageInput) {
    setGroup({...group , ageRange: `${ageInputValue.min}세~${ageInputValue.max}세`});
    }
  }, [ageInputValue]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  }

  const handleCustomFileInputClick = () => {
    document.querySelector('input[type="file"]').click();
  }

  const handleNewBoardButtonClick = () => {
    setGroup({ ...group, boards: [...group.boards, boardName] });
    setBoardName("");
  }

  const checkAgeRange = (item) => {
    if (item === group.ageRange) {
      return 'selected';
    } else if (!ageData.includes(group.ageRange) && item === '직접 입력') {
      return 'selected';
    } else {
      return 'category';
    }
  }

  const validateInput = () => {
    const newCheck = { title: false, description: false, category: false, maxMember: false, age: false };
    if (group.title?.length < titleInputConstraint.minLength) {
      newCheck.title = true;
    }
    if (group.description?.length < descriptionInputConstraint.minLength) {
      newCheck.description = true;
    }
    if (group.category === "") {
      newCheck.category = true;
    }

    if (maxMemberInput) {
      if (group.maxMember < 1) {
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


  const updateGroup = async () => {
    let imageInfo = prevFile;
    try {
      if (image !== null) {
        imageInfo = await singleFileUpload(image);
        setGroup({ ...group, image: { url: imageInfo.url, fileName: imageInfo.filename } });
        console.log("이미지 업로드");
        if (prevFile?.filename !== imageInfo.filename) {
          await deleteFile(prevFile?.filename);
          setPrevFile(imageInfo);
          console.log("이전 파일 삭제");
        }
        console.log(imageInfo);
      }

      const response = await axios.post("/api/group/save", {...group, image: { url: imageInfo?.url, filename: imageInfo?.filename }});
      alert("모임 정보가 수정되었습니다.");
      navigate("/group");

    } catch (error) {
      alert("모임 수정에 실패했습니다.");
      console.error(error);
    };
  }


  return (
    <Container>
      <Item>
        <h2>모임 정보</h2>
        <h4>대표사진</h4>
        <FileInputContainer>
          <input style={{ display: "none" }} type="file" onChange={handleImageChange} />
          <ImagePreview onClick={handleCustomFileInputClick}>
            {!image && group.image && <img className="preview" src={group.image.url} alt="대표 이미지" />}
            {image &&
              <img className="preview" src={URL.createObjectURL(image)} alt="대표 이미지" />
            }
            <div className="camera-icon">
              <img src="/images/icon/camera.svg" alt="대표 이미지 등록" />
            </div>
          </ImagePreview>
        </FileInputContainer>
      </Item>

      <Item>
        <h4>모임명</h4>
        <InputContainer full>
          <Input type="text" placeholder="모임명이 짧을수록 이해하기 쉬워요." value={group.title} onChange={(e) => setGroup({ ...group, title: e.target.value })} />
        </InputContainer>
        <div style={{display: 'flex'}}>
        <InputCheckMessage>{inputCheck.title && "모임명을 3자 이상 입력해주세요."}</InputCheckMessage>
        <TextLength>{`${group.title?.length}/${titleInputConstraint.maxLength}`}</TextLength>
        </div>
      </Item>

      <Item>
        <h4>모임 소개</h4>
        <InputContainer full height="200px">
          <Textarea placeholder="활동 중심으로 모임을 소개해주세요. 모임 설정에서 언제든지 바꿀 수 있어요." onChange={(e) => setGroup({ ...group, description: e.target.value })} value={group.description}>
          </Textarea>
        </InputContainer>
        <div style={{display: 'flex'}}>
        <InputCheckMessage>{inputCheck.description && "모임 소개를 8자 이상 입력해주세요."}</InputCheckMessage>
        <TextLength>{`${group.description?.length}/${descriptionInputConstraint.maxLength}`}</TextLength>
        </div>
      </Item>

      <Item>
        <h4>카테고리</h4>
        <RadioContainer>
          {categoryData.map((item) => (<>
            <RoundFilter key={item.name} title={item.name} variant={group.category === item.name ? 'selected' : 'category'} value={item.name} onClick={() => setGroup({ ...group, category: item.name })} />
          </>
          ))}
        </RadioContainer>
      </Item>

      <Item>
        <h4>연령대</h4>
        <RadioContainer>
          {ageData.map((item) => (
            <RoundFilter title={item} variant={checkAgeRange(item)} value={item} onClick={() => {
              if (item === '직접 입력') {
                setAgeInput(true);
                const ageRange = group.ageRange.split("~");
                if (ageRange.length === 2) {
                ageRange[0] = ageRange[0].replace("세", "");
                ageRange[1] = ageRange[1].replace("세", "");
                setAgeInputValue({ min: ageRange[0], max: ageRange[1] });
                } else {
                  setAgeInputValue({ min: 0, max: 0 });
                }
              } else {
                setAgeInput(false);
                setGroup({ ...group, ageRange: item });
              }
            }} />
          ))}
          {((!ageData.includes(group.ageRange)) || ageInput) && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <InputContainer>
                <Input type="number" value={ageInputValue.min} onChange={(e) => e.target.value > 0 && setAgeInputValue({ ...ageInputValue, min: e.target.value })} />
                <span>세</span>
              </InputContainer>
              <span> ~ </span>
              <InputContainer>
                <Input type="number" value={ageInputValue.max} onChange={(e) => e.target.value > 0 && setAgeInputValue({ ...ageInputValue, max: e.target.value })} />
                <span> 세</span>
              </InputContainer>

            </div>
          )}
        </RadioContainer>
        <InputCheckMessage>{inputCheck.age && '연령대를 입력해 주세요.'}</InputCheckMessage>

      </Item>

      <Item>
        <h2>모임 운영</h2>
        <h4 className="checkbox-wrap">게시판 나누기
          <Switch value={boardDivisions} onChange={(e) => setBoardDivisions(e.target.checked)} />
        </h4>
        {boardDivisions && (
          <>
            {group.boards?.map((item) => (
              <div key={item}>{`${item} ${item === '자유 게시판' ? '(기본)' : ''}`}
                {item !== '자유 게시판' &&
                  <Button title="삭제" onClick={() => setGroup({ ...group, boards: group.boards.filter((board) => board !== item) })} />
                }
              </div>
            ))}
            <div style={{ display: "flex", gap: "8px" }}>
              <InputText type="text" underline placeholder="게시판 제목을 입력해주세요." onChange={(e) => setBoardName(e.target.value)} />
              <Button title="게시판 만들기" onClick={handleNewBoardButtonClick} />
            </div>
          </>
        )
        }

      </Item>

      <Item>
        <h4>본인인증 설정</h4>
        <label className="checkbox-wrap">
          본인인증 사용
          <Switch value={group.requireIdCheck} onChange={(e) => setGroup({ ...group, requireIdCheck: e.target.checked })} />
        </label>
      </Item>

      <Item>
        <h4>별명</h4>
        <label className="checkbox-wrap">
          별명 사용
          <Switch value={group.useNickname} onChange={(e) => setGroup({ ...group, useNickname: e.target.checked })} />
        </label>
      </Item>

      <Item>
        <h2>가입 관리</h2>
        <h4>가입 방식</h4>
        <SelectBoxContainer>
          <SelectBox selected={group.requireApproval === false}>
            바로 가입
            <Radio big name="requireApproval" value={false} checked={group.requireApproval === false} onChange={(e) => setGroup({ ...group, requireApproval: e.target.value === 'true' })} />
          </SelectBox>
          <SelectBox selected={group.requireApproval === true}>
            승인 후 가입
            <Radio big name="requireApproval" value={true} checked={group.requireApproval === true} onChange={(e) => setGroup({ ...group, requireApproval: e.target.value === 'true' })} />
          </SelectBox>
        </SelectBoxContainer>
      </Item>

      <Item>
        <h4>모집 동네 범위 설정</h4>
        <SelectBoxContainer>
          {rangeData.map((item) => (
            <SelectBox key={item.label} selected={item.label === group.groupRange}>
              {item.name}
              <Radio big name="range" value={item.label} checked={item.label === group.groupRange} onChange={(e) => setGroup({ ...group, groupRange: e.target.value })} />
            </SelectBox>
          ))}
        </SelectBoxContainer>
      </Item>


      <Item>
        <h4>최대 인원</h4>
        <RadioContainer>
          {maxMemberData.map((item) => (
            <>
              <RoundFilter title={item === 0 ? "제한없음" : item === -1 ? "직접 입력" : item} variant={item === group.maxMember ? 'selected' : 'category'} value={item} onClick={() => {
                if (item === -1) {
                  setMaxMemberInput(true);
                  setGroup({ ...group, maxMember: -1 });
                } else {
                  setMaxMemberInput(false);
                  setGroup({ ...group, maxMember: item });
                }
              }} />
            </>
          ))}
          {(!maxMemberData.includes(group.maxMember) || maxMemberInput) && (
            <div>
              <InputContainer>
                <Input type="number" value={group.maxMember === 1 ? 0 : group.maxMember} onChange={(e) => e.target.value > 0 && setGroup({...group, maxMember: e.target.value})} />
                <span>명</span>
              </InputContainer>

            </div>
          )}
        </RadioContainer>

        <InputCheckMessage>{inputCheck.maxMember && '최대 인원을 입력해 주세요.'}</InputCheckMessage>
      </Item>

      <ButtonContainer>
        <Button title="취소" onClick={() => navigate(-1)} />
        <Button title="수정하기" variant="primary" onClick={updateGroup} />
      </ButtonContainer>




    </Container>
  );
} 