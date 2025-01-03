import React, { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import styled from "styled-components";
import Button from "../../ui/Button";
import InputText from "../../ui/InputText";
import ImageUpload from "./ImageUpload";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../ui/Breadcrumb";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import useGeolocation from "../../../utils/useGeolocation";
import axios from "axios";
import { singleFileUpload } from "../../../firebase";
import categoryData from "../../../asset/categoryData";

const ButtonContainer = styled.div`
    display: inline-flex;
    gap: 8px;
    margin-bottom: 10px;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: row;
    gap: 36px;

    & .title {
        display: flex;
        gap: 10px;
        font-size: 16px;
        align-items: center;
    }
`;

const Title = styled.div`
    display: flex;
    gap: 36px;
    font-size: 16px;
    align-items: center;


    & .title-wrap {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-grow: 1;
    }
`;


const InputContainer = styled.div`
    flex: 2;
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 12px;
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
    cursor: pointer;
    gap: 8px;
`;

const Checkbox = styled.input`
    margin: 0;
`;

const CategoryToggle = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    position: relative;
    cursor: pointer;
    padding: 8px 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: #f1f1f1;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const CategoryList = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    background: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 10;
    padding: 5px;
    display: ${props => (props.show ? "block" : "none")}; /* 드롭다운 토글 */
    margin-top: 5px;
    width: fit-content;
    white-space: nowrap;
font-weight: normal;
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

    const userId = sessionStorage.getItem('uid');   // 현재 로그인한 사용자 ID

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

    const handleImageChange = async (newImages) => {
        const uploadedFiles = await Promise.all(newImages.map(files => singleFileUpload(files))); // Firebase에 업로드
        setUploadedImages(uploadedFiles); // 상태 업데이트
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

        if (value === "0") {
            setPriceError("판매할 가격은 0원이 될 수 없습니다!");
        } else if (!value) {
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
            images: uploadedImages,
        })], { type: 'application/json' }));

        console.log("Submitting with userId: ", userId);

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
                navigate("/usedTrade", { state: createdUsedTrade, userId });
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
        <>
            <Breadcrumb routes={routes} />
            <Container>

                <Form>
                    <ImageUpload onImageChange={handleImageChange} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%"} }>
                    <InputContainer>
                        <Title>
                            <div className="title-wrap">
                                <h3>제목</h3>
                                <InputText
                                    grow
                                    placeholder="제목"
                                    value={name}
                                    onChange={handleNameChange}
                                    style={{ borderColor: nameError ? 'red' : '#ccc' }}
                                />
                            </div>
                            <CategoryToggle>
                                <span
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
                                    {categoryData.map(category => (
                                        <CategoryItem key={category.name} onClick={() => selectCategory(category.name)}>
                                            {category.name}
                                        </CategoryItem>
                                    ))}
                                </CategoryList>
                            </CategoryToggle>
                        </Title>
                        {nameError && <ErrorText>{nameError}</ErrorText>}
                        </InputContainer>
                        <InputContainer>

                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                            }}>
                                <h3>거래 방식</h3>
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
                            </div>

                            {/* 가격 입력 */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <InputText
                                        placeholder="가격을 입력해주세요"
                                        value={selectedTradeType === "나눔하기" ? "0" : price}
                                        onChange={handlePriceChange}
                                        disabled={selectedTradeType === "나눔하기"}
                                        style={{ borderColor: priceError ? 'red' : '#ccc' }}
                                    /> 원
                                </div>
                                {priceError && <ErrorText>{priceError}</ErrorText>}

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

                            

                            <InputContainer>
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <h3>거래 희망 장소</h3>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <div style={{ marginBottom: "10px", borderColor: locationError ? 'red' : '#ccc' }}>
                                            <label>
                                                <Select value={selectedGu} onChange={handleGuChange}>
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
                                                <Select value={selectedDong} onChange={handleDongChange} disabled={!selectedGu}>
                                                    <option value="" disabled>동을 선택하세요</option>
                                                    {locationData.emd.map((item) => (
                                                        <option key={item} value={item}>{item}</option>
                                                    ))}
                                                </Select>
                                            </label>
                                        </div>
                                    </div>
                                    {locationError && <ErrorText>{locationError}</ErrorText>}
                                </div>
                            </InputContainer>

                            <InputContainer>
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <h3>설명</h3>
                                    <TextArea
                                        placeholder={`${location || "[ 장소 ] "}에 올릴 게시글 내용을 작성해 주세요.\n(판매 금지 물품은 게시가 제한될 수 있습니다.)`}
                                        rows="5"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                </div>
                            </InputContainer>
                        </div>



                </Form>


                <form
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "36px",
                        width: "100%",
                    }}>
                    {/* <Button
                        title="자주 쓰는 문구"
                        onClick={(e) => {
                            e.preventDefault();
                            alert("맥거핀입니다.");
                        }}
                    /> */}
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
                </form>
            </Container>
        </>
    );
};

export default UsedTradeWrite;
