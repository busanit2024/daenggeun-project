import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "../../ui/Button";
import InputText from "../../ui/InputText";
import ImageUpload from "./ImageUpload";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { deleteFile, singleFileUpload } from "../../../firebase";
import imageData from "../../../asset/imageData";
import categoryData from "../../../asset/categoryData";
import Breadcrumb from "../../ui/Breadcrumb";

const ButtonContainer = styled.div`
    display: inline-flex;
    gap: 8px;
    margin-bottom: 10px;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 36px 20px;
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

const ErrorText = styled.small`
    color: red;
    margin-top: 5px;
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
    white-space: nowrap;
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

const TradeButton = styled(Button)`
    background-color: ${props => (props.active ? "#000000" : "#dcdcdc")};
    color: ${props => (props.active ? "#ffffff" : "#000000")};
    border-radius: 30px;
    transition: all 0.3s ease;
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

const UsedTradeUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const product = location.state || {};

    const [userId, setUserId] = useState(sessionStorage.getItem('uid'));    // 현재 로그인한 사용자 ID
    const [isNegotiable, setIsNegotiable] = useState(product.isNegotiable || false);
    const [isGiveable, setIsGiveable] = useState(product.isGiveable || false);
    const [name, setName] = useState(product.name || "상품명이 없습니다.");
    const [createdDate, setCreatedDate] = useState(product.createdDate);
    const [price, setPrice] = useState(product.price ? product.price.toString() : "");
    const [content, setContent] = useState(product.content || "상세 설명이 없습니다.");
    const [locationInput, setLocationInput] = useState(product.location || "위치 정보가 없습니다.");
    const [tradeable, setTradeable] = useState(product.tradeable);

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(product.category.name || null);
    const [selectedTradeType, setSelectedTradeType] = useState(product.isGiveable ? "나눔하기" : "판매하기");
    const [uploadedImages, setUploadedImages] = useState(product.images || []);

    // 이름, 장소, 가격 작성 유무 판단
    const [nameError, setNameError] = useState("");
    const [priceError, setPriceError] = useState("");
    const [locationError, setLocationError] = useState("");

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
                console.log("data:", data);
                setName(data.name);
                setPrice(data.price.toString());
                setContent(data.content);
                setLocationInput(data.location);
                setIsNegotiable(data.isNegotiable);
                setIsGiveable(data.isGiveable || false);
                setCreatedDate(data.createdDate);
                setSelectedCategory(data.category ? data.category.name : null);
                setUploadedImages(data.images || []);
                setSelectedTradeType(data.isGiveable ? "나눔하기" : "판매하기"); // 거래 방식 유지
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        if (!product.name) {
            console.log("11111111");
            fetchProductInfo();
        } else {
            console.log("22222");
            console.log("product", product);

            setName(product.name);
            setPrice(product.price.toString());
            setContent(product.content);
            setLocationInput(product.location);
            setIsNegotiable(product.isNegotiable);
            setIsGiveable(product.isGiveable || false);
            setCreatedDate(product.createdDate);
            setSelectedCategory(product.category ? product.category : null);
            setUploadedImages(product.images);
            setSelectedTradeType(product.isGiveable ? "나눔하기" : "판매하기"); // 거래 방식 유지
        }
    }, [id, product]);

    const handleSubmit = async (e, isTradeComplete = false) => {
        e.preventDefault();

        let hasError = false;

        // 유효성 검사
        if (!name) {
            setNameError("제목을 입력해주세요!");
            hasError = true;
        } else {
            setNameError(""); // 제목이 입력되면 오류 메시지 초기화
        }

        if (selectedTradeType === "판매하기" && price === "0") {
            setPriceError("판매할 가격은 0원이 될 수 없습니다!");
            hasError = true;
        } else if (!price) {
            setPriceError("가격을 입력해주세요!");
            hasError = true;
        } else {
            setPriceError(""); // 가격이 입력되면 오류 메시지 초기화
        }

        if (hasError) return;

        console.log("업로드한 사진: ", uploadedImages);
        const updatedProduct = {
            userId: userId,
            name: name,
            price: parseInt(price.replace(/[^0-9]/g, ""), 10),
            content: content,
            location: locationInput,
            isNegotiable: isNegotiable,
            isGiveable: selectedTradeType === "나눔하기", // selectedTradeType에 따라 isGiveable 결정
            category: selectedCategory,
            createdDate: createdDate,
            tradeable: isTradeComplete ? false : tradeable,
            images: uploadedImages,
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
                alert(isTradeComplete ? "거래가 완료되었습니다." : "수정이 완료되었습니다.");
                navigate(`/usedTradeView/${id}`);
            } else {
                alert("수정에 실패했습니다.");
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert("서버와의 연결에 실패했습니다.");
        }
    };

    // 거래 완료 버튼 클릭 시 호출되는 함수
    const handleTradeComplete = (e) => {
        const confirmComplete = window.confirm("정말로 거래를 완료하시겠습니까?");
        if (confirmComplete) {
            handleSubmit(e, true);
        } else {
            console.log("거래 완료가 취소되었습니다.");
            return;
        }
    }

    const handlePriceChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, "");

        if (value && value !== "0") {
            const formattedValue = Number(value).toLocaleString();
            e.target.value = formattedValue;
        } else if (value === "0") {
            setPriceError("판매할 가격은 0원이 될 수 없습니다!");
        } else if (!value) {
            setPriceError("가격을 입력해주세요!");
        } else {
            setPriceError("");
        }

        setPrice(value);
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
        console.log("newImages: ", newImages);

        // 이전 파일 삭제 처리
        const removedImages = newImages.filter(
            (image) => !newImages.some((newImage) => newImage.filename === image.filename)
        );

        console.log("removedImages: ", removedImages);

        for (const removedImage of removedImages) {
            if (removedImage?.filename) {
                await deleteFile(removedImage.filename);
                console.log(`Deleted file: ${removedImage.filename}`);
            }
        }

        // 새 파일 업로드 처리
        // const uploadedFiles = await Promise.all(
        //     newImages.map((file) => singleFileUpload(file.file))
        // );

        setUploadedImages(newImages); // 상태 업데이트

        // let imageInfo = newImages;
        // if (newImages?.filename !== imageInfo.filename) {
        //     await deleteFile(newImages?.filename);
        //     setUploadedImages(imageInfo);
        //     console.log("이전 파일 삭제");
        //   }

        // const uploadedFiles = await Promise.all(newImages.map(files => singleFileUpload(files))); // Firebase에 업로드
        // setUploadedImages(uploadedFiles); // 상태 업데이트
    };

    const routes = [
        { path: "/", name: "홈" },
        { path: "/usedTradeUpdate/:id", name: "상품 수정하기" },
    ];

    return (
        <>
        <Breadcrumb routes={routes} />
        <Container>
            <Form>
                <ImageUpload img={uploadedImages} onImageChange={handleImageChange} />
                <InputContainer>
                    <Title>
                        <div className="title-wrap">
                            <h3>제목</h3>
                            <InputText
                                placeholder="제목"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                        <Label>
                            {/* 가격 입력 */}
                            <InputText
                                placeholder="가격을 입력해주세요"
                                value={selectedTradeType === "나눔하기" ? "0" : formattedPrice}
                                onChange={handlePriceChange}
                                disabled={selectedTradeType === "나눔하기"}
                                style={{ borderColor: priceError ? 'red' : '#ccc' }}
                            /> 원
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
                        </Label>
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

                    <InputContainer>
                        <h3>설명</h3>
                        <TextArea
                            placeholder={`${locationInput}에 올릴 게시글 내용을 작성해 주세요.\n(판매 금지 물품은 게시가 제한될 수 있습니다.)`}
                            rows="5"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </InputContainer>
                </InputContainer>

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
                        {tradeable && (
                            <Button
                                title="거래완료"
                                variant="white"
                                type="button"
                                onClick={handleTradeComplete}
                            />
                        )}
                    </div>
                </form>


        </Container>
        </>
    );
};

export default UsedTradeUpdate;
