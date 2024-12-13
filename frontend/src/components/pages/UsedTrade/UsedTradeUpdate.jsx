import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "../../ui/Button";
import InputText from "../../ui/InputText";
import ImageUpload from "./ImageUpload";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { singleFileUpload } from "../../../firebase";
import imageData from "../../../asset/imageData";

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
    display: block;
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
    display: ${props => (props.show ? "block" : "none")};
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

const TradeButton = styled(Button)`
    background-color: ${props => (props.active ? "#000000" : "#dcdcdc")};
    color: ${props => (props.active ? "#ffffff" : "#000000")};
    border-radius: 30px;
    transition: all 0.3s ease;
`;

const UsedTradeUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const product = location.state || {};

    const [isNegotiable, setIsNegotiable] = useState(product.isNegotiable || false);
    const [isGiveable, setIsGiveable] = useState(product.isGiveable || false);
    const [name, setName] = useState(product.name || "상품명이 없습니다.");
    const [createdDate, setCreatedDate] = useState(product.createdDate);
    const [price, setPrice] = useState(product.price ? product.price.toString() : "");
    const [content, setContent] = useState(product.content || "상세 설명이 없습니다.");
    const [locationInput, setLocationInput] = useState(product.location || "위치 정보가 없습니다.");

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(product.category || null);
    const [selectedTradeType, setSelectedTradeType] = useState(product.isGiveable ? "나눔하기" : "판매하기");
    const [uploadedImages, setUploadedImages] = useState(product.imageData || []);

    // const getImageUrl = (imageData) => {
    //     // 이미지 데이터가 존재하고 유효한 경우에만 URL로 변환
    //     if (imageData && imageData.length > 0) {
    //         return imageData.map((img) => img.url); // URL을 배열로 반환
    //     }
    //     return []; // 이미지 데이터가 없거나 유효하지 않으면 빈 배열 반환
    // };

    //  // 이미지 URL 가져오기
    //  const imageUrls = getImageUrl(uploadedImages);

    useEffect(() => {
        const fetchProductInfo = async () => {
            try {
                const response = await fetch(`/api/usedTrades/${id}`);
                if (!response.ok) {
                    throw new Error('상품을 가져오는 데 실패했습니다.');
                }
                const data = await response.json();
                setName(data.name);
                setPrice(data.price.toString());
                setContent(data.content);
                setLocationInput(data.location);
                setIsNegotiable(data.isNegotiable);
                setIsGiveable(data.isGiveable || false);
                setCreatedDate(data.createdDate);
                setSelectedCategory(data.category);
                setUploadedImages(data.imageData || []);
                setSelectedTradeType(data.isGiveable ? "나눔하기" : "판매하기"); // 거래 방식 유지
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        if (!product.name) {
            fetchProductInfo();
        } else {
            setName(product.name);
            setPrice(product.price.toString());
            setContent(product.content);
            setLocationInput(product.location);
            setIsNegotiable(product.isNegotiable);
            setIsGiveable(product.isGiveable || false);
            setCreatedDate(product.createdDate);
            setSelectedCategory(product.category);
            setUploadedImages(product.uploadedImages);
            setSelectedTradeType(product.isGiveable ? "나눔하기" : "판매하기"); // 거래 방식 유지
        }
    }, [id, product]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedProduct = {
            name: name,
            price: parseInt(price.replace(/[^0-9]/g, ""), 10),
            content: content,
            location: locationInput,
            isNegotiable: isNegotiable,
            isGiveable: selectedTradeType === "나눔하기", // selectedTradeType에 따라 isGiveable 결정
            category: selectedCategory,
            createdDate: createdDate,
            imageData: uploadedImages,
        };

        try {
            const response = await fetch(`/api/usedTrades/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct),
            });

            if (response.ok) {
                console.log("수정 결과: ", updatedProduct);
                alert("수정이 완료되었습니다.");
                navigate(`/usedTradeView/${id}`);
            } else {
                alert("수정에 실패했습니다.");
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert("서버와의 연결에 실패했습니다.");
        }
    };

    const handlePriceChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, "");

        setPrice(value);

        if (value) {
            const formattedValue = Number(value).toLocaleString();
            e.target.value = formattedValue;
        }
    };

    const formattedPrice = new Intl.NumberFormat('ko-KR').format(price); // 가격 포맷팅하기

    const handleCheckboxChange = () => {
        setIsNegotiable((prev) => !prev);
    };

    const handleTradeTypeChange = (type) => {
        if (selectedTradeType === type) {
            setSelectedTradeType(null); // Toggle off
        } else {
            setSelectedTradeType(type);
        }
    };

    const toggleCategory = () => {
        setIsCategoryOpen((prev) => !prev);
    };

    const selectCategory = (category) => {
        setSelectedCategory(category);
        setIsCategoryOpen(false);
    };

    const handleImageChange = async (newImages) => {
        const uploadedFiles = await Promise.all(newImages.map(files => singleFileUpload(files))); // Firebase에 업로드
        setUploadedImages(uploadedFiles); // 상태 업데이트
    };

    return (
        <Container>
            <h1>중고거래 수정</h1>
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
                        <CategoryItem onClick={() => selectCategory("가구/인테리어")}>
                            가구/인테리어
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
                    onChange={(e) => setName(e.target.value)}
                />

                <div style={{ marginTop: "30px" }}>
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
                </div>

                <Label>
                    {/* 가격 입력 */}
                    <InputText 
                        placeholder="가격을 입력해주세요" 
                        value={selectedTradeType === "나눔하기" ? "0" : formattedPrice}
                        onChange={handlePriceChange}
                        disabled={selectedTradeType === "나눔하기"}
                        // style={{ borderColor: priceError ? 'red' : '#ccc' }}
                    /> 원
                    {/* {priceError && <ErrorText>{priceError}</ErrorText>} */}
                    
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
                </Label>
                </InputContainer>
            </Form>

            <Form>
                <InputContainer>
                    <h3>설명</h3>
                    <TextArea 
                        placeholder={`${locationInput}에 올릴 게시글 내용을 작성해 주세요.\n(판매 금지 물품은 게시가 제한될 수 있습니다.)`}
                        rows="5"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </InputContainer>

                <InputContainer>
                    <h3>거래 희망 장소</h3>
                    <InputText 
                        placeholder="거래 희망 장소" 
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        readOnly
                    />
                </InputContainer>
            </Form>

            <Form 
                style={{ display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginTop: "10px" }}>
                <Button
                    title="자주 쓰는 문구"
                    onClick={() => alert("맥거핀입니다!")}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                        title="수정하기"
                        variant="primary"
                        type="submit"
                        onClick={handleSubmit}
                    />
                    <Button
                        title="취소하기"
                        variant="gray"
                        onClick={() => {
                            navigate(`/usedTradeView/${id}`);
                        }}
                    />
                    <Button
                        title="거래완료"
                        variant="white"
                        onClick={() => {
                            navigate(`/usedTradeView/${id}`);
                        }}
                    />
                </div>
            </Form>
        </Container>
    );
};

export default UsedTradeUpdate;
