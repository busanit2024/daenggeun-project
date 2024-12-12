import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../../ui/Button";
import RoundFilter from "../../ui/RoundFilter";
import { multipleFileUpload } from "../../../firebase";
import Breadcrumb from "../../Breadcrumb";
import { useNavigate } from "react-router-dom";
import useGeolocation from "../../../utils/useGeolocation";
import { useJsApiLoader } from "@react-google-maps/api";
import { deleteFiles } from "../../../firebase";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 24px;
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

const InputCheckMessage = styled.span`
  color: red;
  font-size: 14px;
`;

const titleInputConstraint = { minLength: 3, maxLength: 25 };
const contentInputConstraint = { minLength: 10, maxLength: 1000 };

const libraries = ['places'];

export default function CommunityEditPage(props) {
    const navigate = useNavigate();
    const { communityId } = useParams(); 
    const [categoryData, setCategoryData] = useState([]);
    const [busanJuso, setBusanJuso] = useState(null);
    const [locationData, setLocationData] = useState({sigungu: [], emd: []});

    const [input, setInput] = useState({
        title: '',
        content: '',
        category: [],
        location: {
            sido: "부산광역시", 
            sigungu: "", 
            emd: ""
        },
        images: {
            filename: "",
            url: ""
        }
    });

    const [dbImage, setDbImage] = useState([]); // 기본값으로 빈 배열 설정
    const [image, setImage] = useState([]); // 기본값으로 빈 배열 설정    
    const [inputCheck, setInputCheck] = useState({ title: false, content: false, category: false});
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
        axios.get(`/api/data/filter?name=communityCategory`).then((response) => {
            setCategoryData(response.data.filters);
        }).catch((error) => {
            console.error("카테고리를 불러오는데 실패했습니다." + error);
        })

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

    useEffect(() => {
        axios.get(`/api/community/view/${communityId}`).then((response) => {
            setInput(response.data);
            console.log(response.data.images);
            setDbImage(prevImages => [...prevImages, ...response.data.images]);
            // setDbImage((prev) => ({
            //     ...prev,
            //     images: response.data.images,
            // }));
            // setImage(response.data.images);
            console.log(response.data);
            // fetchMemberInfo(response.data.userId);
          })
          .catch((error) => {
              console.error("동네생활 정보를 불러오는데 실패했습니다." + error);
          });
    }, []);


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
        const newCheck = { title: false, content: false, category: false};
        if (input.title < titleInputConstraint.minLength) {
            newCheck.title = true;
        }
        if (input.content.length < contentInputConstraint.minLength) {
            newCheck.content = true;
        }
        if (input.category === "") {
            newCheck.category = true;
        }
        return newCheck;
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImage(prevImages => [...prevImages, ...files]);
    }

    const handleCustomFileInputClick = () => {
        document.querySelector('input[type="file"]').click();
    }

    const handleImageDelete = async (index) => { // async 추가
        const imageToDelete = image[index];
        try {
            if (input.images && input.images.length > 0) { // community를 props로 변경
                await deleteFiles(input.images.map(image => ({ filename: image.filename }))); // community를 props로 변경
            }
            // imageToDelete.filename을 deleteFiles에 포함시키지 않으므로, 단일 파일 삭제는 필요 없음
            setImage(prevImages => prevImages.filter((_, i) => i !== index));
        } catch (error) {
            console.error("이미지 삭제 실패", error);
        }
    };

    const EditCommunity = async () => {
        if (input.id === null) {
            alert("유효하지 않은 커뮤니티입니다."); // id가 없을 경우 경고
            return; // id가 없으면 함수 종료
            }
        if (input.category === "") {
            alert("카테고리를 선택해주세요.");
            return; // 카테고리가 선택되지 않았으면 함수 종료
        }
        let imageInfo = null;
        try {
            let imageInfo = null;
            if (image.length > 0) {
                imageInfo = await multipleFileUpload(image);
            }

            const userId = sessionStorage.getItem('uid');

            const response = await axios.put(`/api/community/update/${communityId}`, {
                ...input,
                images: imageInfo
            });
            alert("글이 수정되었습니다.");
            navigate("/community");
        } catch (error) {
            alert("글 수정에 실패했습니다.");
            console.error(error);
        }
    }

    const categoryDescriptions = {
        "맛집": `${input.location.emd} 근처 맛집에 대한 이야기를 들려주세요.`,
        "반려동물": "귀여운 반려동물을 자랑해주세요. 잃어버린 동물은 [분실/실종]에 올려주세요.",
        "운동": `${input.location.emd} 근처 이웃과 러닝, 헬스, 테니스 등 운동 이야기를 나눠보세요.`,
        "생활/편의": `${input.location.emd} 근처 세탁소, 프린트, 청소업체 등 생활에 도움 되는 이야기를 들려주세요.`,
        "분실/실종": `무언가를 잃어버리셨나요? ${input.location.emd} 근처 이웃에게 도움을 요청해부세요.`,
        "병원/약국": `${input.location.emd} 근처 병원, 약국 정보를 나눠보세요.`,
        "고민/사연": "고민을 나누고 따뜻한 위로를 받아요.",
        "동네친구": `${input.location.emd} 근처에서 취미, 관심사가 비슷한 친구를 찾아봐요.`,
        "이사/시공": `${input.location.emd} 근처 용달, 인테리어 시공 정보를 나눠보세요.`,
        "주거/부동산": `${input.location.emd} 근처 부동산 정보, 거주 후기를 공유해보세요. 거래 게시글은 노출이 제한될 수 있어요.`,
        "교육": "학원, 과외, 교육과 관련된 이야기를 나눠보세요.",
        "취미": "취미생활에 대해 이야기를 나눠보세요.",
        "동네사건사고": `${input.location.emd}에 일어난 사건사고를 이웃에게 공유해보세요. 잃어버린 동물은 [분실/실종]에 올려주세요.`,
        "동네풍경":`${input.location.emd}에서 볼 수 있는 멋진 풍경과 매력을 이웃과 공유해보세요.`,
        "미용": `${input.location.emd} 근처 헤어, 피부, 네일 등 미용 정보를 나눠보세요.`,
        "임신/육아": `${input.location.emd} 근처 이웃과 임신, 육아 이야기를 나눠보세요.`,
        "일반": "자유롭게 이야기를 나눠보세요.",
    }

    const routes = [
        { path: `/community`, name: `동네생활` },
        { path: `/communityEdit/${communityId}`, name: input.title},
      ];

    return(
        <>
        <Breadcrumb routes={routes} />
        <Container>
            <Item>
                <h2>동네생활 글쓰기</h2>
                <h4>게시글의 주제를 선택해주세요.</h4>
                <RadioContainer>
                    {categoryData.map((item, index) => (<>
                    <RoundFilter key={index} title={item.name} variant={input.category === item.name? 'selected' : 'category'} value={item.name} onClick={() => {setInput({ ...input, category: item.name })}} />
                    </>
                ))}
                </RadioContainer>
                <InputCheckMessage>{inputCheck.category && "게시글 주제를 선택해주세요."}</InputCheckMessage>
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
                <InputContainer full>
                    <Input type="text" placeholder="제목을 입력하세요" value={input.title} onChange={(e) => setInput({ ...input, title: e.target.value })} />
                </InputContainer>
                <div style={{display: 'flex'}}>
                    <InputCheckMessage>{inputCheck.title && "제목을 3자 이상 입력해주세요."}</InputCheckMessage>
                    <TextLength>{`${input.title.length}/${titleInputConstraint.maxLength}`}</TextLength>
                </div>
            </Item>

            <Item>
                <InputContainer full height="500px">
                    <Textarea placeholder={input.category
                    ? `${categoryDescriptions[input.category]}`
                    : `${input.location.emd || '동네'} 이웃과 이야기를 나눠보세요.\n#맛집 #반려동물 #미용...`} 
                    value={input.content} onChange={(e) => setInput({ ...input, content: e.target.value })} />
                </InputContainer>
                <div style={{display: 'flex'}}>
                    <InputCheckMessage>{inputCheck.content && "내용을 10자 이상 입력해주세요."}</InputCheckMessage>
                    <TextLength>{`${input.content.length}/${contentInputConstraint.maxLength}`}</TextLength>
                </div>
            </Item>

            <Item>
                <h2>이미지 첨부</h2>
                <FileInputContainer>
                    <input style={{display: "none"}} type="file" onChange={handleImageChange} multiple/>
                    <CustomFileInput onClick={handleCustomFileInputClick}>
                        <img className="camera-icon" src="/images/icon/camera.svg" alt="이미지 첨부" />
                    </CustomFileInput>
                    {dbImage && Object.values(dbImage).map((item, index) => {
                        console.log("item: ",item);
                        console.log("item.url: ",item.url);
                        return (<ImagePreview>
                            <img key={index} className="preview" src={item.url} alt="첨부된 이미지" />
                            <button className="delete-button" onClick={() => handleImageDelete(index)}>
                            <img src="/images/icon/cancel.svg" alt="삭제" />
                            </button>
                        </ImagePreview>);
                    })}
                    {image && Object.values(image).map((item, index) => {                        
                        return (<ImagePreview>
                            <img key={index} className="preview" src={URL.createObjectURL(item)} alt="첨부된 이미지" />
                            <button className="delete-button" onClick={() => handleImageDelete(index)}>
                            <img src="/images/icon/cancel.svg" alt="삭제" />
                            </button>
                        </ImagePreview>);
                    })}
                </FileInputContainer>
            </Item>

            <ButtonContainer>
                <Button title="수정하기" variant="primary" grow onClick={EditCommunity} />
            </ButtonContainer>
        </Container>
        </>
        
    )
}