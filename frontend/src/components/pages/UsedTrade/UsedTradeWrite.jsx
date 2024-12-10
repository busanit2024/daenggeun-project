import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../ui/Button";
import InputText from "../../ui/InputText";
import ImageUpload from "./ImageUpload";
import { useNavigate } from "react-router-dom";

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

const TradeButton = styled(Button)`
    background-color: ${props => (props.active ? "#000000" : "#dcdcdc")};
    color: ${props => (props.active ? "#ffffff" : "#000000")};
    border-radius: 30px;
    transition: all 0.3s ease;
`;

const UsedTradeWrite = () => {
    const [isPriceNegotiable, setIsPriceNegotiable] = useState(false);  // 체크박스는 기본적으로 체크 X
    const [location, setLocation] = useState("");
    const [content, setContent] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTradeType, setSelectedTradeType] = useState("판매하기");
    const [isGiveable, setIsGiveable] = useState(false);
    const navigate = useNavigate();

    const handlePriceChange = (e) => {
        // 입력값을 숫자만 허용
        let value = e.target.value.replace(/[^0-9]/g, "");

        // 숫자 세 자리 수 단위로 반점 추가
        if (value) {
            value = Number(value).toLocaleString();
        }

        setPrice(value);
    };

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setIsPriceNegotiable(checked);
        console.log("네고 가능 여부: ", checked);
    };

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

        if (!name || !location || !price) {
            alert("제목과 가격, 거래 희망 장소를 입력해주세요!");
            return;
        }

        const usedTradeData = {
            userId: "사용자 ID", // 실제 사용자 id로 나중에 대체
            name: name,
            category: selectedCategory || "카테고리 없음",
            price: parseInt(price.replace(/[^0-9]/g, ""), 10),
            location: location,
            content: content,
            createdDate: new Date().toISOString(),
            images: [],
            views: 0,   // 조회수는 일단 0으로 지정
            isNegotiable: isPriceNegotiable,    // 네고 가능 여부
            isGiveable: isGiveable, // 나눔 신청 가능 여부
            isGived: selectedTradeType, // 판매, 나눔 여부
            tradeble: true,  // 거래 가능 여부
            bookmarkUsers: []
        };

        console.log("isPriceNegotiable:", isPriceNegotiable);
        console.log("isGiveable:", isGiveable);
        console.log("selectedTradeType:", selectedTradeType);

        console.log("usedTradeData: ", usedTradeData);

        try {
            const response = await fetch('/api/usedTrades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usedTradeData),
            });
            console.log(usedTradeData);
            if (response.ok) {
                const createdUsedTrade = await response.json();
                console.log('Trade created:', createdUsedTrade);
                alert("등록되었습니다.");
                navigate("/usedTrade/used-trade");  // 중고거래 등록 후 목록 페이지로 이동
            } else {
                console.error('Failed to create trade');
                alert("등록에 실패했습니다.");
            }
        } catch (error) {
            console.error('Error', error);
            alert("서버와의 연결이 실패했습니다.");
        }
    };

    return (
        <Container>
            <h1>중고거래 등록</h1>
            <Form>
                <ImageUpload />
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
                    /> 원
                    <br />

                    {/* 체크박스 추가 */}
                    <Label>
                        <Checkbox
                            type="checkbox"
                            checked={isPriceNegotiable}
                            onChange={handleCheckboxChange}
                        />
                        {selectedTradeType
                            ? (selectedTradeType === "판매하기"
                                ? "가격 제안 받기"
                                : "나눔 신청 받기")
                            : "판매 / 나눔 중 하나를 선택해 주세요"}
                    </Label>
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
                    <InputText 
                        placeholder="거래 희망 장소" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
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
                            navigate("/usedTrade/used-trade");
                        }}
                    />
                </div>
            </Form>
        </Container>
    );
};

export default UsedTradeWrite;
