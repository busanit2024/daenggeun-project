import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../../ui/Button";
import RoundFilter from "../../ui/RoundFilter";
import { multipleFileUpload, singleFileUpload } from "../../../firebase";


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


const titleInputConstraint = { minLength: 3, maxLength: 24 };
const contentInputConstraint = { minLength: 8, maxLength: 500 };

export default function CommunityWritePage(props) {
    const navigate = useNavigate();

    const [categoryData, setCategoryData] = useState([]);
    const [rangeData, setRangeData] = useState([]);
  
    const [step, setStep] = useState(1);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    const [range, setRange] = useState("0");
    const [image, setImage] = useState([]); // 초기값을 빈 배열로 설정
    const [location, setLocation] = useState({ sido: "부산광역시", sigungu: "해운대구", emd: "반송동" }); // 로그인 구현 될때까지 기본 위치

    useEffect(() => {
        axios.get(`/api/data/filter?name=communityCategory`).then((response) => {
          // 인기글과 전체 카테고리를 제외한 필터링
          const filteredCategories = response.data.filters.filter(category => category.name !== "인기글" && category.name !== "전체");
          setCategoryData(filteredCategories);
        }).catch((error) => {
          console.error("카테고리를 불러오는데 실패했습니다." + error);
        });
    
        axios.get(`/api/data/filter?name=groupRange`).then((response) => {
          setRangeData(response.data.filters);
        }).catch((error) => {
          console.error("동네 범위를 불러오는데 실패했습니다." + error);
        });
      }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // 선택된 파일들을 배열로 변환
    setImage(prevImages => [...prevImages, ...files]); // 기존 이미지 배열에 새로 선택된 파일들을 추가
  }

  const handleCustomFileInputClick = () => {
    document.querySelector('input[type="file"]').click();
  }

  const communityWrite = async () => {
    let imageInfo = null;
    try {
      if (image.length > 0) { // 이미지가 선택되었는지 확인
        imageInfo = await multipleFileUpload(image); 
        console.log(imageInfo);
      }

      const response = await axios.post("/api/community/view", {
        title: title,
        content: content,
        groupRange: range,
        category: category,        
        image: imageInfo ? imageInfo : undefined, // 이미지가 없을 경우 undefined로 설정
        location: location,
      });
      alert("게시글이 등록 됐습니다.");
      navigate("/community/view");

    } catch (error) {
      alert("게시글이 등록 실패했습니다.");
      console.error(error);
    };
  }

  const categoryContents = {
    "맛집": `${location.emd} 근처 맛집에 대한 이야기를 들려주세요.`,
    "반려동물": "귀여운 반려동물을 자랑해주세요. 잃어버린 동물은 [분실/실종]에 올려주세요.",
    "운동": `${location.emd} 근처 이웃과 러닝, 헬스, 테니스 등 운동 이야기를 나눠보세요.`,
    "생활/편의": `${location.emd} 근처 세탁소, 프린트, 청소업체 등 생활에 도움 되는 이야기를 들려주세요.`,
    "분실/실종": `무언가를 잃어버리셨나요? ${location.emd} 근처 이웃들에게 도움을 요청해보세요`,
    "병원/약국": `${location.emd} 근처 병원, 약국 정보를 나눠보세요.`,
    "고민/사연": "고민을 나누고 따뜻한 위로를 받아요.",
    "동네친구": `${location.emd} 근처에서 취미, 관심사가 비슷한 친구를 찾아봐요.`,
    "이사/시공": `${location.emd} 근처 용달, 인테리어 시공 정보를 나눠보세요.`,
    "주거/부동산": `${location.emd} 근처 부동산 정보, 거주 후기를 공유해보세요. 거래 게시글은 노출이 제한될 수 있어요.`,
    "교육": "학원, 과외, 교육과 관련된 이야기를 나눠보세요.",
    "취미": "취미생활에 대해 이야기를 나눠보세요.",
    "동네사건사고": `${location.emd}에 일어난 사건사고를 이웃에게 공유해보세요. 잃어버린 동물은 [분실/실종]에 올려주세요.`,
    "동네풍경": `${location.emd}에서 볼 수 있는 멋진 풍경과 매력을 이웃과 공유해보세요.`,
    "미용": `${location.emd} 근처 헤어, 피부, 네일 등 미용 정보를 나눠보세요.`,
    "임신/육아": `${location.emd} 근처 이웃과 임신, 육아 이야기를 나눠보세요.`,
    "일반": "자유롭게 이야기를 나눠보세요."
  };

  const selectedCategoryContent = category ? categoryContents[category] : "#맛집 #병원 #산책..."; // 카테고리 미선택 시 기본값



  const firstStep = (
    <Container>
      <Item>
        <h4 style={{marginTop: '40px'}}>카테고리</h4>
        <RadioContainer>
          {categoryData.map((item) => (<>
            <RoundFilter key={item.name} title={item.name} variant={category === item.name ? 'selected' : 'category'} value={item.name} onClick={() => {setCategory(item.name)}} />
          </>
          ))}
        </RadioContainer>
      </Item>

      <Item style={{marginTop: "50px"}}>
        <InputContainer full>
          <Input type="text" placeholder="제목을 입력하세요" value={title} onChange={(e) => setTitle(e.target.value)} />
        </InputContainer>
        <TextLength>{`${title.length}/${titleInputConstraint.maxLength}`}</TextLength>
      </Item>


      <Item>        
        <InputContainer full height="500px">
        <Textarea placeholder={`${location.emd} 이웃과 이야기를 나눠보세요.\n${selectedCategoryContent}`} onChange={(e) => setContent(e.target.value)}></Textarea>
        </InputContainer>
        <TextLength>{`${content.length}/${contentInputConstraint.maxLength}`}</TextLength>
      </Item>
    </Container>
  );

  const thirdStep = (
    <Container>
      <Item>
        <p>이미지 첨부</p>
        <FileInputContainer>
          <input style={{ display: "none" }} type="file" multiple onChange={handleImageChange} />
          <CustomFileInput onClick={handleCustomFileInputClick}>
            <img className="camera-icon" src="/images/icon/camera.svg" alt="대표 이미지 등록" />
          </CustomFileInput>
          {image && image.map((img, index) => ( // 이미지 배열을 맵핑하여 여러 이미지를 표시
            <ImagePreview key={index}>
              <img className="preview" src={URL.createObjectURL(img)} alt={`대표 이미지 ${index + 1}`} />
              <button className="delete-button" onClick={() => setImage(prev => prev.filter((_, i) => i !== index))}>
                <img src="/images/icon/cancel.svg" alt="삭제" />
              </button>
            </ImagePreview>
          ))}
        </FileInputContainer>
      </Item>

      <ButtonContainer>
        <Button title="게시하기" variant="primary" grow onClick={communityWrite} />
      </ButtonContainer>

    </Container>
  );

  return (
    <div>
      <h1 style={{marginTop: '40px', textAlign: 'center'}}>동네생활 글쓰기</h1>
      {firstStep}
      {thirdStep}
    </div>
  );
} 