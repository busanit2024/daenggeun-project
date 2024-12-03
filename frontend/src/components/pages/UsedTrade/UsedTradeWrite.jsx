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
    const [price, setPrice] = useState("");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTradeType, setSelectedTradeType] = useState("판매하기");
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

    const handleCheckboxChange = () => {
        setIsPriceNegotiable((prev) => !prev);
    };

    const handleTradeTypeChange = (type) => {
        // 선택된 타입을 업데이트
        if (selectedTradeType === type) {
            setSelectedTradeType(null); // 이미 선택된 버튼이 클릭되면 비활성화
        } else {
            setSelectedTradeType(type); // 새로운 버튼을 선택하면 활성화
        }
    };

    const toggleCategory = () => {
        setIsCategoryOpen((prev) => !prev);
    };

    const selectCategory = (category) => {
        setSelectedCategory(category);
        setIsCategoryOpen(false);   // 선택 후 드롭다운 닫기
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // 기본 제출 이벤트 방지
        alert(
            `등록 완료\n가격 제안 가능 여부: ${
                isPriceNegotiable ? "가능" : "불가능"
            }`
        );
        navigate("/usedTrade/used-trade");
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
                        <CategoryItem onClick={() => selectCategory("여성의류")}>
                            여성의류
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("디지털기기")}>
                            디지털기기
                        </CategoryItem>
                        <CategoryItem onClick={() => selectCategory("생활가전")}>
                            생활가전
                        </CategoryItem>
                    </CategoryList>
                    </CategoryToggle>
                </Form>
                <InputText placeholder="제목" />
                
                <p />
                <div>
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
                    <br />

                    {/* 가격 입력 */}
                    <InputText 
                        placeholder="가격을 입력해주세요" 
                        value={price}
                        onChange={handlePriceChange}
                    /> 원
                    <br />

                    {/* 체크박스 추가 */}
                    <Label>
                        <Checkbox
                            type="checkbox"
                            checked={isPriceNegotiable}
                            onChange={handleCheckboxChange}
                        />
                        {selectedTradeType === "판매하기"
                            ? "가격 제안 받기"
                            : "나눔 신청 받기"}
                    </Label>
                </div>
                </InputContainer>
            </Form>

            <Form>
                <InputContainer>
                    <h3>설명</h3>
                    <TextArea 
                        placeholder="{주소}에 올릴 게시글 내용을 작성해 주세요.
                        (판매 금지 물품은 게시가 제한될 수 있습니다.)"
                        rows="5"
                    />
                </InputContainer>

                <InputContainer>
                    <h3>거래 희망 장소</h3>
                    <InputText placeholder="거래 희망 장소" />
                </InputContainer>
            </Form>

            <Form style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }} onSubmit={handleSubmit}>
                <Button
                    title="자주 쓰는 문구"
                />
                <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                        title="등록하기"
                        variant="primary"
                        type="submit"
                    />
                    <Button
                        title="취소하기"
                        variant="gray"
                        onClick={() => alert("취소")}
                    />
                </div>
            </Form>
        </Container>
    );
};

export default UsedTradeWrite;
