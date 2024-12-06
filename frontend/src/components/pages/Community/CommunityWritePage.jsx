import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../../ui/Button";
import RoundFilter from "../../ui/RoundFilter";
import { multipleFileUpload } from "../../../firebase";
import Breadcrumb from "../../Breadcrumb";
import { useNavigate } from "react-router-dom";
import { validate } from "uuid";

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

export default function CommunityWritePage(props) {
    const navigate = useNavigate();

    const [categoryData, setCategoryData] = useState([]);
    const [busanJuso, setBusanJuso] = useState(null);
    const [locationData, setLocationData] = useState({sigungu: [], emd: []});

    const [input, setInput] = useState({
        title: "",
        content: "",
        category: "",
        location: { sido: "부산광역시", sigungu: "부산진구", emd: "부전동"}
    });

    const [image, setImage] = useState([]);
    const [inputCheck, setInputCheck] = useState({ title: false, content: false, category: false});
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            setInput({ ...input, location: { ...input.location, sigungu: guList[0] } });
            setLocationData({ ...locationData, sigungu: guList });

            const emdList = juso.find((item) => item.sigungu === guList[0])?.emd;
            const emdNameList = emdList?.map((item) => item.emd);
            setInput({ ...input, location: { ...input.location, emd: emdNameList[0] } });
            setLocationData()
        }).catch((error) => {
            console.error("동네 리스트를 불러오는데 실패했습니다." + error);
        });
    }, []);

    useEffect(() => {
        if(isSubmitting) {
            const check = validateInput();
            setInputCheck(check);
        }
    }, [input]);

    useEffect(() => {
        getEmdList(input.location.sigungu);
    }, [input.location.sigungu]);

    const getEmdList = (sigungu) => {
        if (busanJuso) {
            const emdList = busanJuso.find((item) => item.sigungu === sigungu)?.emd;
            const emdNameList = emdList?.map((item) => item.emd);
            setInput({ ...input, location: { ...input.location, emd: emdNameList[0] } });
            setLocationData({ ...locationData, emd: emdNameList });
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
        // const file = e.target.files;
        // console.log("typeof file 어떻게 나옴?: ", typeof file)
        // console.log("file 어떻게 나옴?: ", file)
        // if (file) {         
        //     setImage(file);
        // }
    }

    const handleCustomFileInputClick = () => {
        document.querySelector('input[type="file"]').click();
    }

    const handleImageDelete = (index) => {
        setImage(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const writeCommunity = async () => {
        let imageInfo = null;
        try {
            if(image !== null) {
                imageInfo = await multipleFileUpload(image);
                console.log(imageInfo);
            }

            const response = await axios.post("/api/community/save", {
                ...input,
                images: imageInfo
            });
            alert("글이 작성되었습니다.");
            navigate("/community");
        }catch (error) {
            alert("글 작성에 실패했습니다.");
            console.error(error);
        };
    }

    const routes = [
        { path: `/community`, name: `동네생활` },
        { path: `/community/write`, name: `동네생활 글쓰기`},
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
                    <Textarea placeholder="ㅇㅇ동 이웃과 이야기를 나눠보세요.\n" onChange={(e) => setInput({ ...input, content: e.target.value })} />
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
                    {image && Object.values(image).map((item, index) => {
                        console.log("item: ",item);
                            return (<ImagePreview>
                                <img key={index} className="preview" src={URL.createObjectURL(item)} alt="첨부된 이미지" />
                                <button className="delete-button" onClick={() => handleImageDelete(index)}>
                                <img src="/images/icon/cancel.svg" alt="삭제" />
                                </button>
                            </ImagePreview>);
                        })                    
                    }
                </FileInputContainer>
            </Item>

            <ButtonContainer>
                <Button title="게시하기" variant="primary" grow onClick={writeCommunity} />
            </ButtonContainer>
        </Container>
        </>
        
    )
}