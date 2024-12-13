import React, { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import styled from "styled-components";
import Button from "../../ui/Button";
import InputText from "../../ui/InputText";
import ImageUpload from "./ImageUpload";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../Breadcrumb";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import useGeolocation from "../../../utils/useGeolocation";
import axios from "axios";
import imageData from "../../../asset/imageData";
import UsedTrade from "./UsedTrade";

const ButtonContainer = styled.div`
    display: inline-flex;
    gap: 8px;
    margin-bottom: 10px;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    max-width: 800px;
    margin: auto;
`;

const Form = styled.form`
    display: flex;
    flex-direction: row;
    gap: 20px;
`;

const InputContainer = styled.div`
    flex: 2;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 10px 0;
`;

const TextArea = styled.textarea`
    padding: 8px 16px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: none;
    font-family: inherit;
    
    &:focus {
        border: 1px solid #000000;
        outline: none;
    }
`;

const Label = styled.label`
    display: flex;
    align-items: center;
    font-size: 16px;
    margin-top: 10px;
    cursor: pointer;
    gap: 8px;
`;

const Checkbox = styled.input`
    margin: 0;
`;

const CategoryToggle = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
`;

const CategoryList = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    background: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 10;
    padding: 5px;
    display: ${props => (props.show ? "block" : "none")}; /* 드롭다운 토글 */
    min-width: 100%;
    max-width: 100%;
    margin-top: 5px;
`;

const CategoryItem = styled.div`
    padding: 6px 10px;
    font-size: 14px;
    cursor: pointer;

    &:hover {
        background: #e6e6e6;
    }
`;

const ErrorText = styled.small`
    color: red;
    margin-top: 5px;
`;

const TradeButton = styled(Button)`
    background-color: ${props => (props.active ? "#000000" : "#dcdcdc")};
    color: ${props => (props.active ? "#ffffff" : "#000000")};
    border-radius: 30px;
    transition: all 0.3s ease;
`;

const Select = styled.select`
    padding: 8px 16px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-family: inherit;

    &:focus {
        border: 1px solid #000000;
        outline: none;
    }
`;

const libraries = ['places'];

const UsedTradeWrite = () => {
    const { isLoaded, isJsApiLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
        language: 'ko',
        region: 'KR',
    });

    const currentLocation = useGeolocation(isJsApiLoaded);
    const [busanJuso, setBusanJuso] = useState([]);
    const [locationData, setLocationData] = useState({ sigungu: [], emd: [] });
    const [selectedGu, setSelectedGu] = useState("");
    const [selectedDong, setSelectedDong] = useState("");

    const [isNegotiable, setIsNegotiable] = useState(false);  // 체크박스는 기본적으로 체크 X
    const [location, setLocation] = useState("");

    const [content, setContent] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTradeType, setSelectedTradeType] = useState("판매하기");
    const [isGiveable, setIsGiveable] = useState(false);
    const [tradeable, setTradeable] = useState(true);
    const [uploadedImages, setUploadedImages] = useState([]);

    // 이름, 장소, 가격 작성 유무 판단
    const [nameError, setNameError] = useState("");
    const [priceError, setPriceError] = useState("");
    const [locationError, setLocationError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        // 부산의 구와 동 정보 가져오기
        axios.get('/api/data/filter?name=busanJuso')
            .then((response) => {
                const juso = response.data.locationFilters;
                setBusanJuso(juso);
                const guList = juso.map((item) => item.sigungu);
                setLocationData((prevLocationData) => ({
                    ...prevLocationData,
                    sigungu: guList,
                }));
            })
            .catch((error) => {
                console.error("동네 리스트를 불러오는 데 실패했습니다." + error);
            });
    }, []);

    useEffect(() => {
        // 사용자의 현재 위치를 반영
        if (currentLocation.sigungu) {
            setSelectedGu(currentLocation.sigungu);
            setLocation(`${currentLocation.sigungu} ${selectedDong}`);
        }
    }, [currentLocation]);

    const getEmdList = (sigungu) => {
        if (busanJuso) {
            const emdList = busanJuso.find((item) => item.sigungu === sigungu)?.emd;
            const emdNameList = emdList?.map((item) => item.emd);
            setLocationData((prevLocationData) => ({
                ...prevLocationData,
                emd: emdNameList,
            }));
        }
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
        if (!e.target.value) {
            setNameError("제목을 입력해주세요!");
        } else {
            setNameError("");
        }
    };

    const handleGuChange = (e) => {
        const value = e.target.value;
        setSelectedGu(value);
        setSelectedDong(""); // 동 초기화
        getEmdList(value); // 선택한 구에 대한 동 리스트 가져오기
        if (!e.target.value) {
            setLocationError("거래 희망 장소를 골라주세요!");
        } else {
            setLocationError("");
        }
    };

    const handleDongChange = (e) => {
        const value = e.target.value;
        setSelectedDong(value);
        setLocation(`${selectedGu} ${value}`); // 선택된 구와 동을 기반으로 위치 설정
        if (!e.target.value) {
            setLocationError("거래 희망 장소를 골라주세요!");
        } else {
            setLocationError("");
        }
    };

    const handleImageChange = (images) => {
        setUploadedImages(images);
    };

    useEffect(() => {
        if (selectedGu && selectedDong) {
            setLocation(`${selectedGu} ${selectedDong}`);
        }
    }, [selectedGu, selectedDong]);

    const handlePriceChange = (e) => {
        // 입력값을 숫자만 허용
        let value = e.target.value.replace(/[^0-9]/g, "");

        // 숫자 세 자리 수 단위로 반점 추가
        if (value) {
            value = Number(value).toLocaleString();
        }

        setPrice(value);

        if (!value) {
            setPriceError("가격을 입력해주세요!");
        } else {
            setPriceError("");
        }
    };

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setIsNegotiable(checked);
        console.log("네고 가능 여부: ", checked);
    };

    const handleGiveableChange = (e) => {
        const checked = e.target.checked;
        setIsGiveable(checked);
        console.log("나눔 신청 여부: ", checked);
    }

    const handleTradeTypeChange = (type) => {
        // 선택된 타입을 업데이트
        if (type === "판매하기") {
            setSelectedTradeType("판매하기");
            setIsGiveable(false); // 판매하기 선택 시 나눔 불가
        } else if (type === "나눔하기") {
            setSelectedTradeType("나눔하기");
            setIsGiveable(true); // 나눔하기 선택 시 판매 불가
        }
        console.log("selectedTradeType: ", type);
        console.log("isGiveable: ", type === "나눔하기");
    };

    const toggleCategory = () => {
        setIsCategoryOpen((prev) => !prev);
    };

    const selectCategory = (category) => {
        setSelectedCategory(category);
        setIsCategoryOpen(false);   // 선택 후 드롭다운 닫기
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasError = false;

        // 유효성 검사
        if (!name) {
            setNameError("제목을 입력해주세요!");
            hasError = true;
        }
        if (!location) {
            setLocationError("거래 희망 장소를 선택해주세요!");
            hasError = true;
        }
        if (!isGiveable && !price) {
            setPriceError("가격을 입력해주세요!");
            hasError = true;
        }
        if (hasError) return;

        const confirmSubmit = window.confirm("악용을 방지하기 위해 거래 희망 장소는\n수정을 막고 있습니다. 정말로 등록하시겠습니까?");
        if (!confirmSubmit) return;

        const userId = sessionStorage.getItem('uid');

        // FormData 생성
        const formData = new FormData();
        formData.append('usedTrade', new Blob([JSON.stringify({
            userId: userId,
            name: name,
            category: selectedCategory || "카테고리 없음",
            price: isGiveable ? 0 : parseInt(price.replace(/[^0-9]/g, ""), 10),
            location: location,
            sigungu: selectedGu,
            emd: selectedDong,
            content: content,
            createdDate: new Date().toISOString(),
            views: 0,
            isNegotiable: isNegotiable,
            isGiveable: isGiveable,
            selectedTradeType: selectedTradeType,
            tradeble: tradeable,
            bookmarkUsers: [],
        })], { type: 'application/json' }));

        // 데이터 로그 출력
        console.log("등록할 데이터: ", isNegotiable, isGiveable, tradeable, selectedTradeType);

        // 이미지가 있을 경우 추가
        if (uploadedImages.length > 0) {
            uploadedImages.forEach((img) => {
                formData.append('files', img); // 이미지 파일 추가
            });
        }

        try {
            const response = await fetch('/api/usedTrades', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                const createdUsedTrade = await response.json();
                alert("등록되었습니다.");
                navigate("/usedTrade", { state: formData });
            } else {
                const errorMessage = await response.text();
                console.error('Failed to create trade:', errorMessage);
                alert("등록에 실패했습니다: " + errorMessage);
            }
        } catch (error) {
            console.error('Error', error);
            alert("서버와의 연결이 실패했습니다.");
        }
    };

    const routes = [
        { path: "/", name: "홈" },
        { path: "/usedTradeWrite", name: "중고거래 작성" },
      ];

    return (
        <Container>
            <Breadcrumb routes={routes} />
            <Form>
                <ImageUpload onImageChange={handleImageChange} />
                <InputContainer>
                <Form>
                    <CategoryToggle>
                    <h3>제목</h3>
                    <span 
                        style={{
                            cursor: "pointer", 
                            marginLeft: "200px",
                            padding: "8px 16px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            background: "#f1f1f1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"

                        }}
                        onClick={toggleCategory}
                    >
                        {selectedCategory ? selectedCategory : (isCategoryOpen ? "카테고리 -" : "카테고리 +")}
                    </span>
                    <CategoryList show={isCategoryOpen}>
                        <CategoryItem onClick={() => {
                            setSelectedCategory(null);
                            setIsCategoryOpen(false);
                        }}>
                            None
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("디지털기기")}>
                            디지털기기
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("생활가전")}>
                            생활가전
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("가구/인테리어")}>
                            가구/인테리어
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("생활/주방")}>
                            생활/주방
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("유아동")}>
                            유아동
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("유아도서")}>
                            유아도서
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("여성의류")}>
                            여성의류
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("여성잡화")}>
                            여성잡화
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("남성패션/잡화")}>
                            남성패션/잡화
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("뷰티/미용")}>
                            뷰티/미용
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("스포츠/레저")}>
                            스포츠/레저
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("취미/게임/음반")}>
                            취미/게임/음반
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("도서")}>
                            도서
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("티켓/교환권")}>
                            티켓/교환권
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("가공식품")}>
                            가공식품
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("건강기능식품")}>
                            건강기능식품
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("반려동물용품")}>
                            반려동물용품
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("식물")}>
                            식물
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("기타")}>
                            기타
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("삽니다")}>
                            삽니다
                        </CategoryItem>
                    </CategoryList>
                    </CategoryToggle>
                </Form>
                <InputText 
                    placeholder="제목" 
                    value={name}
                    onChange={handleNameChange}
                    style={{ borderColor: nameError ? 'red' : '#ccc' }}
                />
                {nameError && <ErrorText>{nameError}</ErrorText>}

                <div>
                    <h3 style={{ marginBottom: "10px" }}>거래 방식</h3>
                    <ButtonContainer>
                        <TradeButton
                            key={`판매하기-${selectedTradeType === "판매하기"}`}
                            active={selectedTradeType === "판매하기"}
                            onClick={() => handleTradeTypeChange("판매하기")}
                            title="판매하기"
                            variant="gray"
                            borderRadius="30px"
                        >
                            판매하기
                        </TradeButton>
                        <TradeButton
                            key={`나눔하기-${selectedTradeType === "나눔하기"}`}
                            active={selectedTradeType === "나눔하기"}
                            onClick={() => handleTradeTypeChange("나눔하기")}
                            title="나눔하기"
                            variant="gray"
                            borderRadius="30px"
                        >
                            나눔하기
                        </TradeButton>
                    </ButtonContainer>
                    <br />

                    {/* 가격 입력 */}
                    <InputText 
                        placeholder="가격을 입력해주세요" 
                        value={selectedTradeType === "나눔하기" ? "0" : price}
                        onChange={handlePriceChange}
                        disabled={selectedTradeType === "나눔하기"}
                        style={{ borderColor: priceError ? 'red' : '#ccc' }}
                    /> 원
                    <br />
                    {priceError && <ErrorText>{priceError}</ErrorText>}
                    <br />

                    {/* 체크박스 추가 - 조건부 렌더링 */}
                    {selectedTradeType === "판매하기" && (
                        <Label>
                            <Checkbox
                                type="checkbox"
                                checked={isNegotiable}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setIsNegotiable(checked);
                                    console.log("네고 가능 여부: ", checked);
                                }}
                            />
                            가격 제안 받기
                        </Label>
                    )}
                </div>
                </InputContainer>
            </Form>

            <Form>
                <InputContainer>
                    <h3>설명</h3>
                    <TextArea 
                        placeholder={`${location || "[ 장소 ] "}에 올릴 게시글 내용을 작성해 주세요.\n(판매 금지 물품은 게시가 제한될 수 있습니다.)`}
                        rows="5"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </InputContainer>

                <InputContainer>
                    <h3>거래 희망 장소</h3>
                    <div style={{ marginBottom: "10px", borderColor: locationError ? 'red' : '#ccc' }}>
                        <label>
                            구 선택 : <Select value={selectedGu} onChange={handleGuChange}>
                                <option value="" disabled>구를 선택하세요</option>
                                {locationData.sigungu.map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </Select>
                        </label>
                    </div>
                    {locationError && <ErrorText>{locationError}</ErrorText>}
                    <div style={{ marginBottom: "10px", borderColor: locationError ? 'red' : '#ccc' }}>
                        <label>
                            동 선택 : <Select value={selectedDong} onChange={handleDongChange} disabled={!selectedGu}>
                                <option value="" disabled>동을 선택하세요</option>
                                {locationData.emd.map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </Select>
                        </label>
                    </div>
                    {locationError && <ErrorText>{locationError}</ErrorText>}
                </InputContainer>
            </Form>

            <Form 
                style={{ display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginTop: "10px" }}>
                <Button
                    title="자주 쓰는 문구"
                    onClick={() => alert("맥거핀입니다.")}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                        title="등록하기"
                        variant="primary"
                        type="button"
                        onClick={handleSubmit}
                    />
                    <Button
                        title="취소하기"
                        variant="gray"
                        onClick={() => {
                            navigate("/usedTrade");
                        }}
                    />
                </div>
            </Form>
        </Container>
    );
};

export default UsedTradeWrite;
