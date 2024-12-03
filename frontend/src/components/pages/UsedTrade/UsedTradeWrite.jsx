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
    margin-bottom: 10px;
`;

const CategoryList = styled.div`
    display: ${props => (props.show ? "block" : "none")};
    transition: all 0.3s ease;
    margin-top: 10px;
    background: #F9F9F9;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const TradeButton = styled(Button)`
    background-color: ${props => (props.active ? "#000" : "#ccc")};
    color: ${props => (props.active ? "#fff" : "#000")};
    border-radius: 30px;
`;

const UsedTradeWrite = () => {
    const [isPriceNegotiable, setIsPriceNegotiable] = useState(false);  // 체크박스는 기본적으로 체크 X
    const [price, setPrice] = useState("");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [selectedTradeType, setSelectedTradeType] = useState(null);

    const handlePriceChange = (e) => {
        // 입력값을 숫자만 허용
        let value = e.target.value.replace(/[^0-9]/g, "");

        // 숫자 형식에 맞게 반점 추가
        if (value) {
            value = Number(value).toLocaleString();
        }

        setPrice(value);    // 업데이트
    };

    const handleCheckboxChange = () => {
        setIsPriceNegotiable((prev) => !prev);
    };

    const handleTradeTypeChange = (type) => {
        setSelectedTradeType(type === selectedTradeType ? null : type);
    };

    const toggleCategory = () => {
        setIsCategoryOpen((prev) => !prev);
    };

    return (
        <Container>
            <h1>중고거래 등록</h1>
            <Form>
                <ImageUpload />
                <InputContainer>
                <Form>
                    <h3>제목</h3>
                    <span style={{ cursor: "pointer", marginLeft: "50px" }} onClick={toggleCategory}>
                        {isCategoryOpen ? "카테고리 -" : "카테고리 +"}
                    </span>
                </Form>
                <InputText placeholder="제목" />
                <CategoryList show={isCategoryOpen}>
                    <div>카테고리1</div>
                    <div>카테고리2</div>
                    <div>카테고리3</div>
                </CategoryList>
                <p />
                <div>
                    <h3>거래 방식</h3>
                    <ButtonContainer>
                        <TradeButton
                            title="판매하기"
                            variant="gray"
                            active={selectedTradeType === "판매하기"}
                            onClick={() => handleTradeTypeChange("판매하기")}
                        />
                        <TradeButton
                            title="나눔하기"
                            variant="gray"
                            active={selectedTradeType === "나눔하기"}
                            onClick={() => handleTradeTypeChange("나눔하기")}
                        />
                        {/* <Button
                            borderRadius="30px"
                            title="판매하기"
                            variant="gray"
                        />
                        <Button
                            borderRadius="30px"
                            title="나눔하기"
                            variant="gray"
                        /> */}
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
                        가격 제안 받기
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
                    <div style={{ marginTop: "10px" }}>
                        <Button
                            title="자주 쓰는 문구"
                        />
                    </div>
                </InputContainer>

                <InputContainer>
                    <h3>거래 희망 장소</h3>
                    <InputText placeholder="거래 희망 장소" />
                    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                        <Button
                            title="등록하기"
                            variant="primary"
                            type="submit"
                            onClick={() =>
                                alert(
                                    `등록 완료\n가격 제안 가능 여부: ${
                                        isPriceNegotiable ? "가능" : "불가능"
                                    }`
                                )
                            }
                        />
                        <Button
                            title="취소하기"
                            variant="gray"
                            onClick={() => alert("취소")}
                        />
                    </div>
                </InputContainer>
            </Form>

            
            
        </Container>
    );
};

export default UsedTradeWrite;
