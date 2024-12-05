import React , { useState, useEffect, useRef } from "react";
import Logo from "../../ui/Logo";
import InputText from "../../ui/InputText";
import Button from "../../ui/Button";
import styled from "styled-components";
import SearchModal from "../../ui/LocationSearchModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding: 40px 20px;  // 상단 여백 좀 더 추가
    align-items: center;
    max-width: 460px;    // 최대 너비 설정
    margin: 0 auto;      // 중앙 정렬
`;

const Spacing = styled.div`
    margin: 5px 0;
`;

const RecommendedList = styled.ul`
  list-style: none;
  padding: 0;
`;

const RecommendedItem = styled.li`
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
  &:hover {
    background: #f0f0f0;
  }
`;

const ProfileImageWrapper = styled.div`
    position: relative;
    width: 150px;
    height: 150px;
    border-radius: 75px;
    overflow: hidden;
    border: 2px solid #eee;
    margin: 20px 0;
    cursor: pointer;
    transition: border-color 0.2s ease;

    &:hover {
        border-color: #ddd;
    }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DefaultProfileImage = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  color: #999;
`;

const ImageDeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextContainer = styled.div`
    width: 100%;
    margin-bottom: 20px;
`;

const Title = styled.h3`
    font-size: 1.3rem;
    font-weight: 600;
    margin: 0;
    text-align: left;
    color: #333;
`;

const SubTitle = styled.h4`
    font-size: 1rem;
    font-weight: 400;
    margin: 8px 0;
    text-align: left;
    color: #666;
    line-height: 1.5;
`;

export default function SetProfilePage(props) {
    const [ username, setUsername ] = useState("");
    const [ userLocation, setUserLocation ] = useState("");
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ recommendedLocations, setRecommendedLocations ] = useState([]);
    const [ profileImage, setProfileImage ] = useState(null);
    const fileInput = useRef(null);
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate;

    useEffect(() => {
        const fetchRecommendedLocations = async () => {
        try {
            const response = await axios.get("/api/data/locations");
            setRecommendedLocations(response.data);
        } catch (error) {
            console.error("추천 데이터 로드 실패:", error);
        }
        };
        fetchRecommendedLocations();
    }, []);

    const handleLocationSelect = (location) => {
        setUserLocation(location); 
        setIsModalOpen(false); 
      };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB 제한
                alert('파일 크기는 5MB 이하여야 합니다.');
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
            setProfileImage(file);
        }
    };

    const handleImageDelete = () => {
        setProfileImage(null);
        setPreviewImage(null);
        if (fileInput.current) {
            fileInput.current.value = '';
        }
    };

    const handleStart = async () => {
        if (!username || !userLocation) {
            alert("닉네임과 지역 정보를 모두 입력해주세요!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("location", `${userLocation.sido},${userLocation.sigungu},${userLocation.emd}`);
            if (profileImage) {
                formData.append("profileImage", profileImage);
            }

            const sessionUid = window.sessionStorage.getItem("uid");

            const response = await axios.post(
                `/user/profile`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${sessionUid}`,
                    },
                }
            );

            alert("프로필이 성공적으로 저장되었습니다!");
            navigate("/");
        } catch (error) {
            console.error("프로필 저장 실패:", error);
            alert("프로필 저장 중 문제가 발생했습니다.");
        }
    };

    return (
        <Wrapper>
            <Logo variant="logoWithText" />
            <TextContainer>
                <Title>우리 동네 중고 직거래</Title>
                <SubTitle>
                    당근마켓은 동네 직거래 마켓이에요.<br />
                    내 동네를 설정하고 시작해보세요!
                </SubTitle>
            </TextContainer>

            <TextContainer>
                <Title>내 동네 설정하기</Title>
                <Spacing />
                <InputText
                    value={userLocation}
                    onClick={() => setIsModalOpen(true)}
                    placeholder="지역이나 동네로 검색하기"
                    readOnly
                />
            </TextContainer>

            {isModalOpen && (
                <SearchModal onClose={() => setIsModalOpen(false)}>
                    <Title>지역 선택</Title>
                    <Spacing />
                    <InputText placeholder="지역 검색하기" />
                    <RecommendedList>
                        {recommendedLocations.map((location, index) => (
                            <RecommendedItem
                                key={index}
                                onClick={() => handleLocationSelect(location)}
                            >
                                {location}
                            </RecommendedItem>
                        ))}
                    </RecommendedList>
                </SearchModal>
            )}

            <TextContainer>
                <Title>프로필 설정하기</Title>
                <Spacing />
                <ProfileImageWrapper onClick={() => fileInput.current?.click()}>
                    {previewImage ? (
                        <>
                            <ProfileImage src={previewImage} alt="프로필 이미지" />
                            <ImageDeleteButton onClick={(e) => {
                                e.stopPropagation();
                                handleImageDelete();
                            }}>×</ImageDeleteButton>
                        </>
                    ) : (
                        <DefaultProfileImage>
                            📷
                        </DefaultProfileImage>
                    )}
                </ProfileImageWrapper>
                <InputText 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="닉네임을 입력하세요" 
                />
            </TextContainer>
            
            <Spacing />
            <Button
                title="댕근 시작하기"
                onClick={handleStart}
                variant="primary" 
            />
        </Wrapper>
    );

};